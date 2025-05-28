import * as XLSX from "xlsx";
import * as fs from "fs";
import path from "path";

import collaboratorsData from "../data/collaboratorsData.json";
import servicesData from "../data/commissionableServices.json";
import { CommissionUtils } from "../helpers/excelUtils";
import {
  CommissionRow,
  GroupedCommissions,
  TicketOutput,
  TicketService,
} from "./types";

const transformExcelToJson = () => {
  const collaborators = Object.fromEntries(
    collaboratorsData.data.map((c: any) => [
      c.col_code,
      { id: c.id, col_code: c.col_code },
    ])
  );

  const servicesMap = Object.fromEntries(
    servicesData.data.map((s: any) => [
      CommissionUtils.normalizeServiceName(s.name),
      { id: s.id, basePrice: s.basePrice, name: s.name },
    ])
  );

  const inputPath = path.resolve(__dirname, "../data/commissionsToApp.xlsx");
  const outputPath = path.resolve(__dirname, "./output.json");

  const workbook = XLSX.readFile(inputPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<CommissionRow>(sheet);

  const grouped: GroupedCommissions = new Map();

  for (const row of rows) {
    const key = `${row.Folio}_${row.Fecha}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(row);
  }

  const result: TicketOutput[] = [];

  for (const [key, entries] of grouped) {
    const { Folio, Fecha } = entries[0];

    const ticketNumber = String(Folio);

    const ticket: TicketOutput = {
      date: CommissionUtils.formatDate(Fecha),
      branch: "670a61538ff5ac02957e50f3",
      ticketNumber: ticketNumber,
      services: [],
    };

    const asistenciaRows = entries.filter((r) => r.Servicio === "Asistencia");
    const vetRequestRows = entries.filter(
      (r) => r.Servicio === "Cliente pide Dr especifico"
    );
    const newClientRows = entries.filter((r) => r.Servicio === "Cliente nuevo");
    const salesRows = entries.filter(
      (r) => CommissionUtils.normalizeServiceName(r.Servicio) === "Venta"
    );
    const otherRows = entries.filter(
      (r) =>
        r.Servicio !== "Asistencia" &&
        r.Servicio !== "Cliente pide Dr especifico" &&
        r.Servicio !== "Cliente nuevo" &&
        CommissionUtils.normalizeServiceName(r.Servicio) !== "Venta"
    );

    const services: TicketService[] = [];

    for (const row of otherRows) {
      const col = collaborators[row.Colaborador];
      const normalizedServiceName = CommissionUtils.normalizeServiceName(
        row.Servicio
      );
      const svc = servicesMap[normalizedServiceName];

      if (!col || !svc) {
        console.warn("⚠️ Missing collaborator or service:", row);
        continue;
      }

      services.push({
        serviceId: svc.id,
        serviceName: svc.name,
        basePrice: svc.basePrice,
        discount: CommissionUtils.parseDiscount(row.Desc),
        quantity: Number(row.Cantidad),
        modality: "SIMPLE",
        isBonus: false,
        commissions: [
          {
            collaboratorId: col.id,
            collaboratorCode: col.col_code,
            commissionName: `${svc.name} - SIMPLE`,
            commissionType: "SIMPLE",
            commissionAmount: CommissionUtils.parseCurrency(row.Comisión),
          },
        ],
      });
    }

    const assignBonus = (
      sourceRows: CommissionRow[],
      type: "VET_REQUESTED" | "NEW_CLIENT" | "SALES"
    ) => {
      for (const row of sourceRows) {
        const col = collaborators[row.Colaborador];
        if (!col) continue;

        let targetService: TicketService | undefined;

        if (type === "SALES") {
          const surgeryIndex = services.findIndex(
            (s) =>
              CommissionUtils.normalizeServiceName(s.serviceName) === "Cirugía"
          );

          if (surgeryIndex !== -1) {
            targetService = services[surgeryIndex];
            services[surgeryIndex] = {
              ...targetService,
              isBonus: true,
              bonusType: type,
              commissions: [
                ...targetService.commissions,
                {
                  collaboratorId: col.id,
                  collaboratorCode: col.col_code,
                  commissionName: `${targetService.serviceName} - ${type}`,
                  commissionType: type,
                  commissionAmount: CommissionUtils.parseCurrency(row.Comisión),
                },
              ],
            };
            continue;
          }
        }

        if (!targetService && services.length > 0) {
          targetService = services.reduce((prev, curr) => {
            const prevTotal = prev.commissions.reduce(
              (sum, c) => sum + c.commissionAmount,
              0
            );
            const currTotal = curr.commissions.reduce(
              (sum, c) => sum + c.commissionAmount,
              0
            );
            return currTotal > prevTotal ? curr : prev;
          });
        }

        if (targetService) {
          if (type !== "SALES") {
            targetService.modality = "ASSISTED";
          }
          targetService.isBonus = true;
          targetService.bonusType = type;
          targetService.commissions.push({
            collaboratorId: col.id,
            collaboratorCode: col.col_code,
            commissionName: `${targetService.serviceName} - ${type}`,
            commissionType: type,
            commissionAmount: CommissionUtils.parseCurrency(row.Comisión),
          });
        } else {
          console.warn(`⚠️ Could not assign ${type} bonus:`, row);
        }
      }
    };

    for (const row of asistenciaRows) {
      const col = collaborators[row.Colaborador];
      if (!col) continue;

      let targetService = services.find(
        (s) => s.serviceName === "Consulta" || s.serviceName === "Vacuna"
      );

      if (!targetService && services.length > 0) {
        targetService = services.reduce((prev, curr) => {
          const prevTotal = prev.commissions.reduce(
            (sum, c) => sum + c.commissionAmount,
            0
          );
          const currTotal = curr.commissions.reduce(
            (sum, c) => sum + c.commissionAmount,
            0
          );
          return currTotal > prevTotal ? curr : prev;
        });
      }

      if (targetService) {
        targetService.modality = "ASSISTED";
        targetService.commissions.push({
          collaboratorId: col.id,
          collaboratorCode: col.col_code,
          commissionName: `${targetService.serviceName} - ASSISTED`,
          commissionType: "ASSISTED",
          commissionAmount: CommissionUtils.parseCurrency(row.Comisión),
        });
      } else {
        console.warn("⚠️ Could not assign Asistencia commission:", row);
      }
    }

    assignBonus(vetRequestRows, "VET_REQUESTED");
    assignBonus(newClientRows, "NEW_CLIENT");
    assignBonus(salesRows, "SALES");

    ticket.services = services;
    result.push(ticket);
  }

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
  console.log("✅ JSON saved to", outputPath);
};

transformExcelToJson();

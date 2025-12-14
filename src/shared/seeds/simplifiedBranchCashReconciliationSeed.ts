import {
  BranchModel,
  MongoDatabase,
  SimplifiedBranchCashReconciliationModel,
} from "../../infrastructure";
import { getEnvsByEnvironment } from "../helpers";

const CASHIER_ID = "61dff1cb4131595911ad13fb";

// Datos iniciales por sucursal
const initialReconciliationData = [
  {
    branchName: "Urban",
    records: [
      {
        transactionDate: "2025-01-12",
        cashInDrawerStart: 0,
        qvetCashInDrawer: 9071,
        cashInDrawerEnd: 9071,
        cashTransfer: 0,
        closingCash: 9071,
      },
      {
        transactionDate: "2025-01-13",
        cashInDrawerStart: 9071,
        qvetCashInDrawer: 4350,
        cashInDrawerEnd: 13421,
        cashTransfer: 3421,
        closingCash: 10000,
      },
      {
        transactionDate: "2025-01-14",
        cashInDrawerStart: 10000,
        qvetCashInDrawer: 4435,
        cashInDrawerEnd: 14435,
        cashTransfer: 4435,
        closingCash: 10000,
      },
    ],
  },
  {
    branchName: "Harbor",
    records: [
      {
        transactionDate: "2025-01-12",
        cashInDrawerStart: 0,
        qvetCashInDrawer: 4325,
        cashInDrawerEnd: 4325,
        cashTransfer: 0,
        closingCash: 4325,
      },
      {
        transactionDate: "2025-01-13",
        cashInDrawerStart: 4325,
        qvetCashInDrawer: 2423,
        cashInDrawerEnd: 6748,
        cashTransfer: 1748,
        closingCash: 5000,
      },
      {
        transactionDate: "2025-01-14",
        cashInDrawerStart: 5000,
        qvetCashInDrawer: 2423,
        cashInDrawerEnd: 7423,
        cashTransfer: 2423,
        closingCash: 5000,
      },
    ],
  },
  {
    branchName: "Montejo",
    records: [
      {
        transactionDate: "2025-01-12",
        cashInDrawerStart: 0,
        qvetCashInDrawer: 1700,
        cashInDrawerEnd: 1700,
        cashTransfer: 0,
        closingCash: 1700,
      },
      {
        transactionDate: "2025-01-13",
        cashInDrawerStart: 1700,
        qvetCashInDrawer: 1135,
        cashInDrawerEnd: 2835,
        cashTransfer: 835,
        closingCash: 2000,
      },
      {
        transactionDate: "2025-01-14",
        cashInDrawerStart: 2000,
        qvetCashInDrawer: 1135,
        cashInDrawerEnd: 3135,
        cashTransfer: 1135,
        closingCash: 2000,
      },
    ],
  },
];

export const seedSimplifiedBranchCashReconciliation = async () => {
  try {
    const { MONGO_URL, MONGO_DB_NAME } = getEnvsByEnvironment();

    console.log("Connecting to MongoDB...");
    await MongoDatabase.connect({
      mongoUrl: MONGO_URL,
      dbName: MONGO_DB_NAME,
    });

    console.log("Deleting existing records...");
    await SimplifiedBranchCashReconciliationModel.deleteMany({});

    console.log("Fetching branches...");
    const branches = await BranchModel.find();
    if (!branches.length) {
      console.error("No branches found in the database.");
      return;
    }

    console.log("Preparing reconciliation data...");
    for (const { branchName, records } of initialReconciliationData) {
      const branch = branches.find((b) => b.name === branchName);

      if (!branch) {
        console.warn(`Branch not found: ${branchName}. Skipping...`);
        continue;
      }

      for (const record of records) {
        const transactionDate = new Date(record.transactionDate);

        // Verifica si ya existe un registro para esta sucursal y fecha
        const existingRecord =
          await SimplifiedBranchCashReconciliationModel.findOne({
            branchId: branch._id,
            transactionDate,
          });

        if (existingRecord) {
          console.log(
            `Record for branch "${branchName}" on date "${record.transactionDate}" already exists. Skipping...`
          );
          continue;
        }

        // Crear un nuevo registro si no existe
        const newRecord = new SimplifiedBranchCashReconciliationModel({
          branchId: branch._id,
          cashierId: CASHIER_ID,
          transactionDate,
          transactionDatetime: new Date(`${record.transactionDate}T12:00:00`), // Fecha con hora
          cashInDrawerStart: record.cashInDrawerStart,
          qvetCashInDrawer: record.qvetCashInDrawer,
          cashInDrawerEnd: record.cashInDrawerEnd,
          cashTransfer: record.cashTransfer,
          closingCash: record.closingCash,
          status: "COMPLETED", // Estado predeterminado
          notes: `Seed data for ${branchName} on ${record.transactionDate}`,
        });

        await newRecord.save();
        console.log(
          `Created record for branch "${branchName}" on date "${record.transactionDate}".`
        );
      }
    }

    console.log("Seed operation completed successfully!");
  } catch (error) {
    console.error("Error during seed operation:", error);
  } finally {
    console.log("Closing database connection...");
    // await MongoDatabase.disconnect();
  }
};

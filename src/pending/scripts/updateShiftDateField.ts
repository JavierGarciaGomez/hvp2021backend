import mongoose from "mongoose";

import { CollaboratorModel } from "../../infrastructure/db/mongo/models/collaborator.model";
import { AttendanceRecordModel } from "../../infrastructure/db/mongo/models/attendance-record.model"; // Asegúrate de que esta ruta sea correcta

async function updateShiftDateField() {
  try {
    // Conéctate a la base de datos
    await mongoose.connect("mongodb://mongo-user:123456@localhost:27017", {});

    // Busca los registros que necesitan ser actualizados
    const shifts = await AttendanceRecordModel.find();
    const cols = await CollaboratorModel.find();
    console.log(cols.length, { cols });

    // Itera sobre cada registro y actualiza el campo shiftDate
    console.log(shifts.length, { shifts });
    for (const shift of shifts) {
      if (typeof shift.shiftDate === "string") {
        // Convierte la cadena a una fecha en formato UTC
        const newShiftDate = new Date(shift.shiftDate + "Z"); // Agrega 'Z' para indicar UTC
        shift.shiftDate = newShiftDate; // Actualiza el campo
        await shift.save(); // Guarda el registro actualizado
      }
    }

    console.log("Actualización completada.");
  } catch (error) {
    console.error("Error actualizando el campo shiftDate:", error);
  } finally {
    await mongoose.disconnect(); // Cierra la conexión a la base de datos
  }
}

updateShiftDateField();

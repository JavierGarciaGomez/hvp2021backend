import mongoose from "mongoose";
import { AttendanceRecordModel } from "../../infrastructure";

export async function updateShiftDateField() {
  console.log("Actualizando campo shiftDate...");
  const getBranchId = (name: string): string | null => {
    const branchMap = {
      Montejo: "670a61538ff5ac02957e50e3",
      Urban: "670a61538ff5ac02957e50f3",
      Harbor: "670a61538ff5ac02957e50eb",
    };
    return branchMap[name as keyof typeof branchMap] || null;
  };
  try {
    // Fetch records needing updates with lean to return plain JS objects
    const shifts = await AttendanceRecordModel.find().lean();

    for (const shift of shifts) {
      const updates: any = {}; // Object to hold updates

      // Convert shiftDate to UTC Date if it’s a string
      if (typeof shift.shiftDate === "string") {
        updates.shiftDate = new Date(shift.shiftDate);
      }

      // Convert clockInBranch and clockOutBranch to ObjectId if they’re strings
      const inBranchId = getBranchId(shift.clockInBranch as unknown as string);
      const outBranchId = getBranchId(
        shift.clockOutBranch as unknown as string
      );

      if (inBranchId)
        updates.clockInBranch = new mongoose.Types.ObjectId(inBranchId);
      if (outBranchId)
        updates.clockOutBranch = new mongoose.Types.ObjectId(outBranchId);

      // Apply updates if any
      if (Object.keys(updates).length > 0) {
        await AttendanceRecordModel.updateOne(
          { _id: shift._id },
          { $set: updates }
        );
      }
    }

    console.log("Actualización completada.");
  } catch (error) {
    console.error("Error actualizando el campo shiftDate:", error);
  }
}

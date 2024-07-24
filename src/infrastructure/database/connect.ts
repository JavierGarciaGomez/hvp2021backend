import mongoose from "mongoose";
import { envs } from "../../config";

export class DatabaseService {
  static async connect(): Promise<void> {
    try {
      await mongoose.connect(envs.DB_CNN);

      console.log("DB Online");
    } catch (error) {
      console.error(error);
      throw new Error("Error initializing DB");
    }
  }
}

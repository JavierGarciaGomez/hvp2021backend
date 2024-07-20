import { envsPlugin } from "../infrastructure/adapters";

import mongoose from "mongoose";
import { getEnvsByEnvironment } from "../shared/helpers";
import { MongoDatabase } from "../infrastructure/db/mongo";
import {
  NotificationActionType,
  NotificationReferenceType,
} from "../domain/enums";
import { NotificationModel } from "../infrastructure/db/mongo/models/notification.model";

const MONGO_URI = "your_mongo_db_connection_string";

const seedNotifications = async () => {
  console.log({ envsPlugin });
  try {
    const { MONGO_URL, MONGO_DB_NAME } = getEnvsByEnvironment();
    await MongoDatabase.connect({
      mongoUrl: MONGO_URL,
      dbName: MONGO_DB_NAME,
    });

    const notifications = Array.from({ length: 20 }).map((_, index) => ({
      user: new mongoose.Types.ObjectId(), // Replace with actual user IDs
      title: `Notification Title ${index + 1}`,
      message: `This is the message for notification ${index + 1}`,
      referenceId: `ref${index + 1}`,
      referenceType: NotificationReferenceType.AUTH_ACTIVITY, // Replace with actual reference type
      actionType: NotificationActionType.ASSIGNED, // Replace with actual action type
      read: false,
      createdBy: new mongoose.Types.ObjectId(), // Replace with actual user IDs
      updatedBy: new mongoose.Types.ObjectId(), // Replace with actual user IDs
    }));

    await NotificationModel.insertMany(notifications);
    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedNotifications();

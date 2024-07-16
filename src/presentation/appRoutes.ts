import { Router } from "express";
import { mainRoutes } from "../mainRoutes";
import { cleanupsRouter } from "../routes/cleanUpsRoutes";
import {
  activityRegisterRoutes,
  collaboratorLogRoutes,
  collaboratorsRoutes,
  documentationRoutes,
  fcmRoutes,
  miscRoutes,
  rfcRoutes,
  userClientRoutes,
  userLogRoutes,
  usersRoutes,
} from "../routes";
import { AttendanceRecordsRoutes } from "./resources/attendanceRecords/attendanceRecordsRoutes";
import { AuthRoutes } from "./resources/auth/authRoutes";
import { AuthActivitiesRoutes } from "./resources/authActivities/authActivitiesRoutes";
import { BillingRoutes } from "./resources/billing/billingRoutes";
import { TasksRoutes } from "./resources/tasks/tasksRoutes";
import { TimeOffRequestsRoutes } from "./resources/timeOffRequests/timeOffRequestsRoutes";
import { WorkLogsRoutes } from "./resources/workLogs/workLogsRoutes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // router.use("/api/collaborators", CollaboratorRoutes.routes);

    router.use(mainRoutes.activityRegister, activityRegisterRoutes);
    router.use(mainRoutes.attendanceRecords, AttendanceRecordsRoutes.routes);
    router.use(mainRoutes.auth, AuthRoutes.routes);
    router.use(mainRoutes.authActivities, AuthActivitiesRoutes.routes);
    router.use(mainRoutes.billing, BillingRoutes.routes);
    router.use(mainRoutes.cleanUps, cleanupsRouter);
    router.use(mainRoutes.collaboratorLog, collaboratorLogRoutes);
    router.use(mainRoutes.collaborators, collaboratorsRoutes);
    router.use(mainRoutes.documentation, documentationRoutes);
    router.use(mainRoutes.fcm, fcmRoutes);
    router.use(mainRoutes.misc, miscRoutes);
    router.use(mainRoutes.rfc, rfcRoutes);
    router.use(mainRoutes.tasks, TasksRoutes.routes);
    router.use(mainRoutes.timeOffRequests, TimeOffRequestsRoutes.routes);
    router.use(mainRoutes.users, usersRoutes);
    router.use(mainRoutes.workLogs, WorkLogsRoutes.routes);
    router.use(mainRoutes.userClient, userClientRoutes);
    router.use(mainRoutes.userLog, userLogRoutes);

    return router;
  }
}

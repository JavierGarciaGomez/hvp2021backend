"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
const express_1 = require("express");
const mainRoutes_1 = require("../mainRoutes");
const cleanUpsRoutes_1 = require("../pending/routes/cleanUpsRoutes");
const routes_1 = require("../pending/routes");
const attendanceRecordsRoutes_1 = require("./resources/attendanceRecords/attendanceRecordsRoutes");
const authRoutes_1 = require("./resources/auth/authRoutes");
const authActivitiesRoutes_1 = require("./resources/authActivities/authActivitiesRoutes");
const billingRoutes_1 = require("./resources/billing/billingRoutes");
const tasksRoutes_1 = require("./resources/tasks/tasksRoutes");
const timeOffRequestsRoutes_1 = require("./resources/timeOffRequests/timeOffRequestsRoutes");
const workLogsRoutes_1 = require("./resources/workLogs/workLogsRoutes");
const notification_routes_1 = require("./routes/notification.routes");
const collaborator_routes_1 = require("./routes/collaborator.routes");
class AppRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        // router.use("/api/collaborators", CollaboratorRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.activityRegister, routes_1.activityRegisterRoutes);
        router.use(mainRoutes_1.mainRoutes.attendanceRecords, attendanceRecordsRoutes_1.AttendanceRecordsRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.auth, authRoutes_1.AuthRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.authActivities, authActivitiesRoutes_1.AuthActivitiesRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.billing, billingRoutes_1.BillingRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.cleanUps, cleanUpsRoutes_1.cleanupsRouter);
        router.use(mainRoutes_1.mainRoutes.collaboratorLog, routes_1.collaboratorLogRoutes);
        router.use(mainRoutes_1.mainRoutes.collaborators, new collaborator_routes_1.CollaboratorRoutes().getRoutes());
        router.use(mainRoutes_1.mainRoutes.documentation, routes_1.documentationRoutes);
        router.use(mainRoutes_1.mainRoutes.fcm, routes_1.fcmRoutes);
        router.use(mainRoutes_1.mainRoutes.misc, routes_1.miscRoutes);
        router.use(mainRoutes_1.mainRoutes.notifications, new notification_routes_1.NotificationRoutes().getRoutes());
        router.use(mainRoutes_1.mainRoutes.rfc, routes_1.rfcRoutes);
        router.use(mainRoutes_1.mainRoutes.tasks, tasksRoutes_1.TasksRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.timeOffRequests, timeOffRequestsRoutes_1.TimeOffRequestsRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.users, routes_1.usersRoutes);
        router.use(mainRoutes_1.mainRoutes.workLogs, workLogsRoutes_1.WorkLogsRoutes.routes);
        router.use(mainRoutes_1.mainRoutes.userClient, routes_1.userClientRoutes);
        router.use(mainRoutes_1.mainRoutes.userLog, routes_1.userLogRoutes);
        return router;
    }
}
exports.AppRoutes = AppRoutes;

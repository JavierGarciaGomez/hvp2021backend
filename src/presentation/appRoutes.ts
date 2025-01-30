import { Router } from "express";
import { mainRoutes } from "../mainRoutes";
import { cleanupsRouter } from "../pending/routes/cleanUpsRoutes";
import {
  collaboratorLogRoutes,
  documentationRoutes,
  fcmRoutes,
  rfcRoutes,
  userClientRoutes,
  userLogRoutes,
  usersRoutes,
} from "../pending/routes";

import { AuthRoutes } from "./resources/auth/authRoutes";
import { AuthActivitiesRoutes } from "./resources/authActivities/authActivitiesRoutes";
import { BillingRoutes } from "./resources/billing/billingRoutes";
import { TasksRoutes } from "./resources/tasks/tasksRoutes";

import { WorkLogsRoutes } from "./resources/workLogs/workLogsRoutes";
import {
  ActivityRegisterRoutes,
  ActivityRegisterTypeRoutes,
  CollaboratorRoutes,
  ControlledPrescriptionRoutes,
  NotificationRoutes,
  ProductRoutes,
  SupplierRoutes,
  MissingProductRoutes,
  BranchRoutes,
  WeekShiftRoutes,
  PublicHolidaysRoutes,
  SalaryDataRoutes,
  JobRoutes,
  ImagesRoutes,
  AttendanceRecordRoutes,
  SaleRoutes,
  BranchCashReconciliationRoutes,
  TimeOffRequestRoutes,
  EmploymentRoutes,
} from "./routes";
import { AccountRoutes } from "./routes/account.routes";
import { SimplifiedBranchCashReconciliationRoutes } from "./routes/simplified-branch-cash-reconciliation.routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // router.use("/api/collaborators", CollaboratorRoutes.routes);

    // router.use(mainRoutes.activityRegister, activityRegisterRoutes);
    // router.use(mainRoutes.attendanceRecords, AttendanceRecordsRoutes.routes);
    router.use(mainRoutes.auth, AuthRoutes.routes);
    router.use(mainRoutes.authActivities, AuthActivitiesRoutes.routes);
    router.use(mainRoutes.billing, BillingRoutes.routes);
    router.use(mainRoutes.cleanUps, cleanupsRouter);
    router.use(mainRoutes.collaboratorLog, collaboratorLogRoutes);
    router.use(mainRoutes.collaborators, new CollaboratorRoutes().getRoutes());
    router.use(mainRoutes.documentation, documentationRoutes);
    router.use(mainRoutes.fcm, fcmRoutes);
    router.use(mainRoutes.notifications, new NotificationRoutes().getRoutes());
    router.use(mainRoutes.rfc, rfcRoutes);
    router.use(mainRoutes.tasks, TasksRoutes.routes);
    router.use(
      mainRoutes.timeOffRequests,
      new TimeOffRequestRoutes().getRoutes()
    );
    router.use(mainRoutes.users, usersRoutes);
    router.use(mainRoutes.workLogs, WorkLogsRoutes.routes);
    router.use(mainRoutes.userClient, userClientRoutes);
    router.use(mainRoutes.userLog, userLogRoutes);
    router.use(mainRoutes.products, new ProductRoutes().getRoutes());
    router.use(mainRoutes.suppliers, new SupplierRoutes().getRoutes());
    router.use(
      mainRoutes.controlledPrescriptions,
      new ControlledPrescriptionRoutes().getRoutes()
    );
    router.use(
      mainRoutes.activityRegisterTypes,
      new ActivityRegisterTypeRoutes().getRoutes()
    );
    router.use(
      mainRoutes.activityRegister,
      new ActivityRegisterRoutes().getRoutes()
    );
    router.use(
      mainRoutes.missingProducts,
      new MissingProductRoutes().getRoutes()
    );
    router.use(mainRoutes.branches, new BranchRoutes().getRoutes());
    router.use(mainRoutes.weekShifts, new WeekShiftRoutes().getRoutes());
    router.use(
      mainRoutes.publicHolidays,
      new PublicHolidaysRoutes().getRoutes()
    );
    router.use(mainRoutes.salaryData, new SalaryDataRoutes().getRoutes());
    router.use(mainRoutes.jobs, new JobRoutes().getRoutes());
    router.use(mainRoutes.images, new ImagesRoutes().getRoutes());
    router.use(
      mainRoutes.attendanceRecords,
      new AttendanceRecordRoutes().getRoutes()
    );
    router.use(mainRoutes.accounts, new AccountRoutes().getRoutes());
    router.use(mainRoutes.sales, new SaleRoutes().getRoutes());
    router.use(
      mainRoutes.branchCashReconciliation,
      new BranchCashReconciliationRoutes().getRoutes()
    );
    router.use(
      mainRoutes.simplifiedBranchCashReconciliation,
      new SimplifiedBranchCashReconciliationRoutes().getRoutes()
    );
    router.use(mainRoutes.employments, new EmploymentRoutes().getRoutes());

    return router;
  }
}

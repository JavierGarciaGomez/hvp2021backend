"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRecordsRoutes = exports.AttendanceRecordsPaths = void 0;
const express_1 = require("express");
const attendanceRecordService_1 = require("./attendanceRecordService");
const attendanceRecordsController_1 = require("./attendanceRecordsController");
const middlewares_1 = require("../../middlewares");
var AttendanceRecordsPaths;
(function (AttendanceRecordsPaths) {
    AttendanceRecordsPaths["all"] = "/";
    AttendanceRecordsPaths["current"] = "/current";
    AttendanceRecordsPaths["byCollaborator"] = "/collaborator/:collaboratorId";
    AttendanceRecordsPaths["lastByCollaborator"] = "/collaborator/:collaboratorId/last";
    AttendanceRecordsPaths["byId"] = "/:id";
    AttendanceRecordsPaths["create"] = "/";
    AttendanceRecordsPaths["update"] = "/:id";
    AttendanceRecordsPaths["delete"] = "/:id";
})(AttendanceRecordsPaths || (exports.AttendanceRecordsPaths = AttendanceRecordsPaths = {}));
class AttendanceRecordsRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const service = new attendanceRecordService_1.AttendanceRecordsService();
        const controller = new attendanceRecordsController_1.AttendanceRecordsController(service);
        router.use(middlewares_1.AuthMiddleware.validateJWT);
        router.get(AttendanceRecordsPaths.all, controller.getAttendanceRecords);
        router.get(AttendanceRecordsPaths.byCollaborator, controller.getAttendanceRecordsByCollaborator);
        router.get(AttendanceRecordsPaths.current, controller.getCurrentAttendanceRecords);
        router.get(AttendanceRecordsPaths.lastByCollaborator, controller.getLastAttendanceRecordByCollaborator);
        router.get(AttendanceRecordsPaths.byId, controller.getAttendanceRecordById);
        router.post(AttendanceRecordsPaths.create, controller.createAttendanceRecord);
        router.patch(AttendanceRecordsPaths.update, controller.updateAttendanceRecord);
        router.delete(AttendanceRecordsPaths.delete, controller.deleteAttendanceRecord);
        return router;
    }
}
exports.AttendanceRecordsRoutes = AttendanceRecordsRoutes;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTag = exports.TaskStatus = exports.TaskPriority = void 0;
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["High"] = "High";
    TaskPriority["Medium"] = "Medium";
    TaskPriority["Low"] = "Low";
    TaskPriority["Exploratory"] = "Exploratory";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Backlog"] = "Backlog";
    TaskStatus["OnHold"] = "On hold";
    TaskStatus["Next"] = "Next";
    TaskStatus["InProgress"] = "In progress";
    TaskStatus["InReview"] = "In review";
    TaskStatus["Completed"] = "Completed";
    TaskStatus["Canceled"] = "Canceled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskTag;
(function (TaskTag) {
    TaskTag["Maintenance"] = "Maintenance";
    TaskTag["Inventory"] = "Inventory";
    TaskTag["Suppliers"] = "Suppliers";
    TaskTag["Customers"] = "Customers";
    TaskTag["Petco"] = "Petco";
    TaskTag["HumanResources"] = "HR";
    TaskTag["Billing"] = "Billing";
    TaskTag["Reports"] = "Reports";
    TaskTag["Advertising"] = "Advertising";
    TaskTag["SocialMedia"] = "Social media";
    TaskTag["Events"] = "Events";
    TaskTag["WebApp"] = "Web app";
    TaskTag["Qvet"] = "Qvet";
    TaskTag["General"] = "General";
    TaskTag["FileManagement"] = "File management";
})(TaskTag || (exports.TaskTag = TaskTag = {}));

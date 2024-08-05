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
    TaskTag["Accounting"] = "Accounting";
    TaskTag["Advertising"] = "Advertising";
    TaskTag["Billing"] = "Billing";
    TaskTag["Customers"] = "Customers";
    TaskTag["Documentation"] = "Documentation";
    TaskTag["Equipment"] = "Equipment";
    TaskTag["Events"] = "Events";
    TaskTag["FileManagement"] = "File management";
    TaskTag["General"] = "General";
    TaskTag["HumanResources"] = "HR";
    TaskTag["Inventory"] = "Inventory";
    TaskTag["Maintenance"] = "Maintenance";
    TaskTag["Petco"] = "Petco";
    TaskTag["Qvet"] = "Qvet";
    TaskTag["Reports"] = "Reports";
    TaskTag["SocialMedia"] = "Social media";
    TaskTag["SocialSecurity"] = "Social security";
    TaskTag["Suppliers"] = "Suppliers";
    TaskTag["Taxes"] = "Taxes";
    TaskTag["WebApp"] = "Web app";
})(TaskTag || (exports.TaskTag = TaskTag = {}));
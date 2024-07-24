"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkLogDto = void 0;
class WorkLogDto {
    constructor(data) {
        this.data = data;
    }
    static create(data) {
        return this.createOrUpdate(data);
    }
    static update(data) {
        return this.createOrUpdate(data);
    }
    static createOrUpdate(data) {
        const validationError = this.validateOptions(data);
        if (validationError)
            return [validationError];
        const { activities } = data;
        return [undefined, new WorkLogDto(Object.assign(Object.assign({}, data), { activities }))];
    }
    static validateOptions(data) {
        let { activities } = data;
        return undefined;
    }
}
exports.WorkLogDto = WorkLogDto;

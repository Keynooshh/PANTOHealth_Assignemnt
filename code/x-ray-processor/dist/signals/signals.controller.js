"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalsController = void 0;
const common_1 = require("@nestjs/common");
const signals_service_1 = require("./signals.service");
let SignalsController = class SignalsController {
    constructor(signalDataService) {
        this.signalDataService = signalDataService;
    }
    async insertXrayData(createSignalData) {
        return this.signalDataService.create(createSignalData);
    }
    getAllSignals() {
        return this.signalDataService.getAll();
    }
    async getById(params) {
        const signal = await this.signalDataService.getOne(params.id);
        if (!signal) {
            throw new common_1.NotFoundException(`Signal with ID ${params.id} not found`);
        }
        return signal;
    }
    async updateById(id, updateData) {
        return this.signalDataService.update(id, updateData);
    }
    deleteById(params) {
        return this.signalDataService.delete(params.id);
    }
    async getFilteredSignals(filters) {
        return this.signalDataService.getFiltered(filters);
    }
};
exports.SignalsController = SignalsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignalsController.prototype, "insertXrayData", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SignalsController.prototype, "getAllSignals", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignalsController.prototype, "getById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SignalsController.prototype, "updateById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SignalsController.prototype, "deleteById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignalsController.prototype, "getFilteredSignals", null);
exports.SignalsController = SignalsController = __decorate([
    (0, common_1.Controller)('/v1/signals'),
    __metadata("design:paramtypes", [signals_service_1.SignalsDataService])
], SignalsController);
//# sourceMappingURL=signals.controller.js.map
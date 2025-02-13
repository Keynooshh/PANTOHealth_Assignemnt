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
exports.XrayDataService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const xray_schema_1 = require("./xray.schema");
const signals_service_1 = require("../signals/signals.service");
let XrayDataService = class XrayDataService {
    constructor(xrayDataModel, signalDataService) {
        this.xrayDataModel = xrayDataModel;
        this.signalDataService = signalDataService;
    }
    async create(xrayData) {
        const createData = this.xrayDataModel({
            deviceId: new Map(Object.entries(xrayData)),
        });
        return this.xrayDataModel.insertOne(createData);
    }
    async processData(message) {
        const result = this.create(message);
        const DeviceMapData = (await result).deviceId;
        DeviceMapData.forEach((deviceData, deviceId) => {
            this.signalDataService.processSignalData(deviceData, deviceId);
        });
    }
    getAll() {
        return this.xrayDataModel.find().batchSize(10).exec();
    }
    getOne(id) {
        return this.xrayDataModel.findById(id);
    }
};
exports.XrayDataService = XrayDataService;
exports.XrayDataService = XrayDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(xray_schema_1.XrayData.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        signals_service_1.SignalsDataService])
], XrayDataService);
//# sourceMappingURL=xray.service.js.map
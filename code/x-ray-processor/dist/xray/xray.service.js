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
var XrayDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XrayDataService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const xray_schema_1 = require("./xray.schema");
const signals_service_1 = require("../signals/signals.service");
const AppLogger_service_1 = require("../AppLogger.service");
let XrayDataService = XrayDataService_1 = class XrayDataService {
    constructor(xrayDataModel, signalDataService, logger) {
        this.xrayDataModel = xrayDataModel;
        this.signalDataService = signalDataService;
        this.logger = logger;
        logger.setContext(XrayDataService_1.name);
    }
    async create(xrayData) {
        try {
            const deviceId = Object.keys(xrayData)[0];
            const { data, time } = xrayData[deviceId];
            const ParsedData = data.map((entry) => {
                const [time, [x, y, speed]] = entry;
                return { time, coordinates: { x, y }, speed };
            });
            const createData = new this.xrayDataModel({
                deviceId: deviceId,
                time: time,
                data: ParsedData,
            }).save();
            this.logger.log('Saved XrayData in Mongo.');
            return createData;
        }
        catch (error) {
            this.logger.error('Encounterd error while saving XrayData in Mongo:\n' + error.message);
            return error.message;
        }
    }
    async processData(message) {
        const DeviceData = await this.create(message);
        this.signalDataService.processSignalData(DeviceData);
    }
    getAll() {
        return this.xrayDataModel.find().batchSize(10).exec();
    }
    getOne(id) {
        return this.xrayDataModel.findById(id);
    }
};
exports.XrayDataService = XrayDataService;
exports.XrayDataService = XrayDataService = XrayDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(xray_schema_1.XrayData.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        signals_service_1.SignalsDataService,
        AppLogger_service_1.AppLogger])
], XrayDataService);
//# sourceMappingURL=xray.service.js.map
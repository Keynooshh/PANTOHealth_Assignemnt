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
exports.SignalsDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const signals_schema_1 = require("./signals.schema");
const mongoose_2 = require("mongoose");
let SignalsDataService = class SignalsDataService {
    constructor(signalDataModel) {
        this.signalDataModel = signalDataModel;
    }
    async create(signalData) {
        return this.signalDataModel.create(signalData);
    }
    async processSignalData(deviceData, deviceId) {
        const signalData = {
            deviceId: deviceId,
            time: deviceData.time,
            dataLength: deviceData.data.length,
        };
        this.create(signalData);
    }
    getAll() {
        return this.signalDataModel.find().batchSize(10).exec();
    }
    getOne(id) {
        return this.signalDataModel.findById(id).exec();
    }
    async update(id, updateData) {
        const resource = await this.signalDataModel.findById(id).exec();
        if (!resource) {
            throw new common_1.NotFoundException('Resource not found');
        }
        Object.assign(resource, updateData);
        return resource.save();
    }
    delete(id) {
        return this.signalDataModel.findByIdAndDelete(id);
    }
    async getFiltered(filters) {
        const query = this.signalDataModel.find();
        if (filters.time) {
            query.where('time').equals(filters.time);
        }
        return query.exec();
    }
};
exports.SignalsDataService = SignalsDataService;
exports.SignalsDataService = SignalsDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(signals_schema_1.SignalData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SignalsDataService);
//# sourceMappingURL=signals.service.js.map
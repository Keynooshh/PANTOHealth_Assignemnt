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
var SignalsDataService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalsDataService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const signals_schema_1 = require("./signals.schema");
const mongoose_2 = require("mongoose");
const AppLogger_service_1 = require("../AppLogger.service");
let SignalsDataService = SignalsDataService_1 = class SignalsDataService {
    constructor(signalDataModel, logger) {
        this.signalDataModel = signalDataModel;
        this.logger = logger;
        logger.setContext(SignalsDataService_1.name);
    }
    async create(signalData) {
        try {
            this.logger.log('Added processed data SignalData into mongo.');
            return this.signalDataModel.create(signalData);
        }
        catch (error) {
            this.logger.error('Encounterd error while saving SignalData in Mongo:\n' + error.message);
            throw new common_1.HttpException('Failed to create SignalData', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async processSignalData(deviceData) {
        const times = deviceData.data.map((entry) => entry.time);
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        const speeds = deviceData.data.map((entry) => entry.speed);
        const avgSpeed = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
        let totalDistance = 0;
        for (let i = 1; i < deviceData.data.length; i++) {
            const prev = deviceData.data[i - 1].coordinates;
            const curr = deviceData.data[i].coordinates;
            const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
            totalDistance += distance;
        }
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const entry of deviceData.data) {
            const x = entry.coordinates.x;
            const y = entry.coordinates.y;
            if (x < minX)
                minX = x;
            if (x > maxX)
                maxX = x;
            if (y < minY)
                minY = y;
            if (y > maxY)
                maxY = y;
        }
        const signalData = {
            deviceId: deviceData.deviceId,
            dataLength: deviceData.data.length,
            time: deviceData.time,
            timeRange: { minTime, maxTime },
            averageSpeed: avgSpeed,
            totalDistance: totalDistance,
            geoData: { minX, maxX, minY, maxY },
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
        if (filters.deviceId) {
            query.where('deviceId').equals(filters.deviceId);
        }
        if (filters.dataLength) {
            query.where('dataLength').equals(filters.dataLength);
        }
        if (filters.time) {
            query.where('time').equals(filters.time);
        }
        if (filters.timeRange) {
            if (filters.timeRange.minTime) {
                query.where('timeRange.minTime').gte(filters.timeRange.minTime);
            }
            if (filters.timeRange.maxTime) {
                query.where('timeRange.maxTime').lte(filters.timeRange.maxTime);
            }
        }
        if (filters.geoData) {
            if (filters.geoData.minX) {
                query.where('geoData.minX').gte(filters.geoData.minX);
            }
            if (filters.geographicalBounds.maxX) {
                query.where('geoData.maxX').lte(filters.geoData.maxX);
            }
            if (filters.geographicalBounds.minY) {
                query.where('geoData.minY').gte(filters.geoData.minY);
            }
            if (filters.geographicalBounds.maxY) {
                query.where('geoData.maxY').lte(filters.geoData.maxY);
            }
        }
        return query.exec();
    }
};
exports.SignalsDataService = SignalsDataService;
exports.SignalsDataService = SignalsDataService = SignalsDataService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(signals_schema_1.SignalData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        AppLogger_service_1.AppLogger])
], SignalsDataService);
//# sourceMappingURL=signals.service.js.map
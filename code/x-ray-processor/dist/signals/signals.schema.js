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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signalDataSchema = exports.SignalData = exports.GeoData = exports.TimeRange = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TimeRange = class TimeRange {
};
exports.TimeRange = TimeRange;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TimeRange.prototype, "minTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], TimeRange.prototype, "maxTime", void 0);
exports.TimeRange = TimeRange = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TimeRange);
let GeoData = class GeoData {
};
exports.GeoData = GeoData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GeoData.prototype, "minX", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GeoData.prototype, "maxX", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GeoData.prototype, "minY", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], GeoData.prototype, "maxY", void 0);
exports.GeoData = GeoData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], GeoData);
let SignalData = class SignalData extends mongoose_2.Document {
};
exports.SignalData = SignalData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SignalData.prototype, "deviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SignalData.prototype, "dataLength", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SignalData.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TimeRange, required: true }),
    __metadata("design:type", TimeRange)
], SignalData.prototype, "timeRange", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SignalData.prototype, "averageSpeed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SignalData.prototype, "totalDistance", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: GeoData, required: true }),
    __metadata("design:type", GeoData)
], SignalData.prototype, "geoData", void 0);
exports.SignalData = SignalData = __decorate([
    (0, mongoose_1.Schema)({ collection: 'signals' })
], SignalData);
exports.signalDataSchema = mongoose_1.SchemaFactory.createForClass(SignalData);
//# sourceMappingURL=signals.schema.js.map
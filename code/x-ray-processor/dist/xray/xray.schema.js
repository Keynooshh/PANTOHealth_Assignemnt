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
exports.XrayDataSchema = exports.XrayData = exports.DeviceData = exports.DataPoint = exports.Location = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Location = class Location {
};
exports.Location = Location;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Location.prototype, "x", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Location.prototype, "y", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Location.prototype, "speed", void 0);
exports.Location = Location = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Location);
let DataPoint = class DataPoint {
};
exports.DataPoint = DataPoint;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DataPoint.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Location, required: true }),
    __metadata("design:type", Location)
], DataPoint.prototype, "location", void 0);
exports.DataPoint = DataPoint = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DataPoint);
let DeviceData = class DeviceData {
};
exports.DeviceData = DeviceData;
__decorate([
    (0, mongoose_1.Prop)({ type: [DataPoint], required: true }),
    __metadata("design:type", Array)
], DeviceData.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DeviceData.prototype, "time", void 0);
exports.DeviceData = DeviceData = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DeviceData);
let XrayData = class XrayData extends mongoose_2.Document {
};
exports.XrayData = XrayData;
__decorate([
    (0, mongoose_1.Prop)({ type: Object, of: DeviceData, required: true }),
    __metadata("design:type", Map)
], XrayData.prototype, "deviceId", void 0);
exports.XrayData = XrayData = __decorate([
    (0, mongoose_1.Schema)({ collection: 'x-ray-data' })
], XrayData);
exports.XrayDataSchema = mongoose_1.SchemaFactory.createForClass(XrayData);
//# sourceMappingURL=xray.schema.js.map
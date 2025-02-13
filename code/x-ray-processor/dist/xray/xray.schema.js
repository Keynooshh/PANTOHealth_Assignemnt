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
exports.XrayDataSchema = exports.XrayData = exports.DataPoint = exports.Coordinates = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Coordinates = class Coordinates {
};
exports.Coordinates = Coordinates;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Coordinates.prototype, "x", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Coordinates.prototype, "y", void 0);
exports.Coordinates = Coordinates = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Coordinates);
let DataPoint = class DataPoint {
};
exports.DataPoint = DataPoint;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DataPoint.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Coordinates, required: true }),
    __metadata("design:type", Coordinates)
], DataPoint.prototype, "coordinates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DataPoint.prototype, "speed", void 0);
exports.DataPoint = DataPoint = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], DataPoint);
let XrayData = class XrayData extends mongoose_2.Document {
};
exports.XrayData = XrayData;
__decorate([
    (0, mongoose_1.Prop)({ type: [DataPoint], required: true }),
    __metadata("design:type", Array)
], XrayData.prototype, "data", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], XrayData.prototype, "time", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], XrayData.prototype, "deviceId", void 0);
exports.XrayData = XrayData = __decorate([
    (0, mongoose_1.Schema)({ collection: 'x-ray-data' })
], XrayData);
exports.XrayDataSchema = mongoose_1.SchemaFactory.createForClass(XrayData);
//# sourceMappingURL=xray.schema.js.map
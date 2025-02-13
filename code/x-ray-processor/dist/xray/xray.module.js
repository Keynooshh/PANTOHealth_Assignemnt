"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XrayDataModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const xray_schema_1 = require("./xray.schema");
const xray_service_1 = require("./xray.service");
const xray_controller_1 = require("./xray.controller");
const signals_module_1 = require("../signals/signals.module");
let XrayDataModule = class XrayDataModule {
};
exports.XrayDataModule = XrayDataModule;
exports.XrayDataModule = XrayDataModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: xray_schema_1.XrayData.name, schema: xray_schema_1.XrayDataSchema },
            ]),
            signals_module_1.SignalsModule,
        ],
        controllers: [xray_controller_1.XrayController],
        providers: [xray_service_1.XrayDataService],
        exports: [
            mongoose_1.MongooseModule.forFeature([
                { name: xray_schema_1.XrayData.name, schema: xray_schema_1.XrayDataSchema },
            ]),
        ],
    })
], XrayDataModule);
//# sourceMappingURL=xray.module.js.map
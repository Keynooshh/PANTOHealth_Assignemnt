"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQModule = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const rmq_service_1 = require("./rmq.service");
const xray_service_1 = require("../xray/xray.service");
const xray_module_1 = require("../xray/xray.module");
const signals_module_1 = require("../signals/signals.module");
let RabbitMQModule = class RabbitMQModule {
};
exports.RabbitMQModule = RabbitMQModule;
exports.RabbitMQModule = RabbitMQModule = __decorate([
    (0, common_1.Module)({
        imports: [xray_module_1.XrayDataModule, signals_module_1.SignalsModule],
        providers: [rmq_service_1.RMQConsumerService, xray_service_1.XrayDataService, config_1.ConfigService],
    })
], RabbitMQModule);
//# sourceMappingURL=rmq.module.js.map
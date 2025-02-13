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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const json_reader_service_1 = require("./json-reader.service");
const rabbitmq_service_1 = require("./rabbitmq.service");
let AppController = class AppController {
    constructor(jsonReaderService, RMQService) {
        this.jsonReaderService = jsonReaderService;
        this.RMQService = RMQService;
    }
    jsonReader() {
        return this.jsonReaderService.reader('./json/x-ray.json');
    }
    startProducer() {
        const message = this.jsonReaderService.reader('./json/x-ray.json');
        this.RMQService.sendMessage(message);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('json-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "jsonReader", null);
__decorate([
    (0, common_1.Post)('start-producer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "startProducer", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [json_reader_service_1.JsonReaderService,
        rabbitmq_service_1.RMQService])
], AppController);
//# sourceMappingURL=app.controller.js.map
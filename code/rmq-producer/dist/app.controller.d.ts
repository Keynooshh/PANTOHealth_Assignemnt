import { JsonReaderService } from './json-reader.service';
import { RMQService } from './rabbitmq.service';
export declare class AppController {
    private readonly jsonReaderService;
    private readonly RMQService;
    constructor(jsonReaderService: JsonReaderService, RMQService: RMQService);
    jsonReader(): string;
    startProducer(): void;
}

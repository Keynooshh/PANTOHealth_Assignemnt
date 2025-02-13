import { Model } from 'mongoose';
import { XrayData } from './xray.schema';
import { SignalsDataService } from 'src/signals/signals.service';
import { AppLogger } from '../AppLogger.service';
export declare class XrayDataService {
    private readonly xrayDataModel;
    private readonly signalDataService;
    private readonly logger;
    constructor(xrayDataModel: Model<XrayData>, signalDataService: SignalsDataService, logger: AppLogger);
    create(xrayData: any): Promise<any>;
    processData(message: any): Promise<void>;
    getAll(): Promise<(import("mongoose").Document<unknown, {}, XrayData> & XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getOne(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, XrayData> & XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, XrayData> & XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, XrayData, "findOne", {}>;
}

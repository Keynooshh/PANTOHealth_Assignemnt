import { Model } from 'mongoose';
import { XrayData } from './xray.schema';
import { SignalsDataService } from 'src/signals/signals.service';
export declare class XrayDataService {
    private readonly xrayDataModel;
    private readonly signalDataService;
    repository: any;
    constructor(xrayDataModel: Model<XrayData>, signalDataService: SignalsDataService);
    create(xrayData: any): Promise<import("mongoose").Document<unknown, {}, XrayData> & XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
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

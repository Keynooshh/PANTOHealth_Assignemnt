import { SignalData } from './signals.schema';
import { Model } from 'mongoose';
import { XrayData } from 'src/xray/xray.schema';
import { AppLogger } from 'src/AppLogger.service';
export declare class SignalsDataService {
    private readonly signalDataModel;
    private readonly logger;
    constructor(signalDataModel: Model<SignalData>, logger: AppLogger);
    create(signalData: any): Promise<SignalData>;
    processSignalData(deviceData: XrayData): Promise<void>;
    getAll(): Promise<(import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getOne(id: any): Promise<(import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    update(id: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    delete(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, SignalData, "findOneAndDelete", {}>;
    getFiltered(filters: any): Promise<(import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}

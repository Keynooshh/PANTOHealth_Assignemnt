import { SignalsDataService } from './signals.service';
export declare class SignalsController {
    private readonly signalDataService;
    constructor(signalDataService: SignalsDataService);
    insertXrayData(createSignalData: any): Promise<import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getAllSignals(): Promise<(import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getById(params: any): Promise<import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateById(id: string, updateData: any): Promise<import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    deleteById(params: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, import("./signals.schema").SignalData, "findOneAndDelete", {}>;
    getFilteredSignals(filters: any): Promise<(import("mongoose").Document<unknown, {}, import("./signals.schema").SignalData> & import("./signals.schema").SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}

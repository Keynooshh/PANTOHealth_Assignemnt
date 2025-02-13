import { SignalData } from './signals.schema';
import { Model } from 'mongoose';
import { DeviceData } from 'src/xray/xray.schema';
export declare class SignalsDataService {
    private readonly signalDataModel;
    constructor(signalDataModel: Model<SignalData>);
    create(signalData: any): Promise<import("mongoose").Document<unknown, {}, SignalData> & SignalData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    processSignalData(deviceData: DeviceData, deviceId: string): Promise<void>;
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

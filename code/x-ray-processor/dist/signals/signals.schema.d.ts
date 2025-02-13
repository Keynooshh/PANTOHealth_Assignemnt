import { Document } from 'mongoose';
export declare class TimeRange {
    minTime: number;
    maxTime: number;
}
export declare class GeoData {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}
export declare class SignalData extends Document {
    deviceId: string;
    dataLength: number;
    time: number;
    timeRange: TimeRange;
    averageSpeed: number;
    totalDistance: number;
    geoData: GeoData;
}
export declare const signalDataSchema: import("mongoose").Schema<SignalData, import("mongoose").Model<SignalData, any, any, any, Document<unknown, any, SignalData> & SignalData & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SignalData, Document<unknown, {}, import("mongoose").FlatRecord<SignalData>> & import("mongoose").FlatRecord<SignalData> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

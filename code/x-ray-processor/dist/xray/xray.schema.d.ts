import { Document } from 'mongoose';
export declare class Coordinates {
    x: number;
    y: number;
}
export declare class DataPoint {
    time: number;
    coordinates: Coordinates;
    speed: number;
}
export declare class XrayData extends Document {
    data: DataPoint[];
    time: number;
    deviceId: string;
}
export declare const XrayDataSchema: import("mongoose").Schema<XrayData, import("mongoose").Model<XrayData, any, any, any, Document<unknown, any, XrayData> & XrayData & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, XrayData, Document<unknown, {}, import("mongoose").FlatRecord<XrayData>> & import("mongoose").FlatRecord<XrayData> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;

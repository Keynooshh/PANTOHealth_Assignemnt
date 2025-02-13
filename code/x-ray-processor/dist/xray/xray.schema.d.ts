import { Document } from 'mongoose';
export declare class Location {
    x: number;
    y: number;
    speed: number;
}
export declare class DataPoint {
    time: number;
    location: Location;
}
export declare class DeviceData {
    data: DataPoint[];
    time: number;
}
export declare class XrayData extends Document {
    deviceId: Map<string, DeviceData>;
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

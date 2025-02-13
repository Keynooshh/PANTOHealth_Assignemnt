import { XrayDataService } from './xray.service';
export declare class XrayController {
    private readonly xrayDataSerivce;
    constructor(xrayDataSerivce: XrayDataService);
    getAllXray(): Promise<(import("mongoose").Document<unknown, {}, import("./xray.schema").XrayData> & import("./xray.schema").XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getById(params: any): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./xray.schema").XrayData> & import("./xray.schema").XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null, import("mongoose").Document<unknown, {}, import("./xray.schema").XrayData> & import("./xray.schema").XrayData & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }, {}, import("./xray.schema").XrayData, "findOne", {}>;
}

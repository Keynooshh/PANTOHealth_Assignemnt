import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { XrayData } from './xray.schema';
import { SignalsDataService } from 'src/signals/signals.service';

@Injectable()
export class XrayDataService {
  repository: any;
  constructor(
    @InjectModel(XrayData.name)
    private readonly xrayDataModel: Model<XrayData>,
    private readonly signalDataService: SignalsDataService,
  ) {}

  async create(xrayData: any) {     //THIS MOTHER FUCKER 
    const createData = new this.xrayDataModel({
      deviceId: new Map(Object.entries(xrayData)),
    });
    return this.xrayDataModel.insertOne(createData);
  }
  

  async processData(message: any) {
    const result = this.create(message);
    const DeviceMapData = (await result).deviceId;
    DeviceMapData.forEach((deviceData, deviceId) => {
      this.signalDataService.processSignalData(deviceData, deviceId);
    });
  }

  getAll() {
    return this.xrayDataModel.find().batchSize(10).exec();
  }

  getOne(id: string) {
    return this.xrayDataModel.findById(id);
  }

}

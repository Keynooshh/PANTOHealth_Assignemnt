import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignalData } from './signals.schema';
import { Model } from 'mongoose';
import { DeviceData } from 'src/xray/xray.schema';

@Injectable()
export class SignalsDataService {
  constructor(
    @InjectModel(SignalData.name)
    private readonly signalDataModel: Model<SignalData>,
  ) {}

  async create(signalData: any) {
    return this.signalDataModel.create(signalData); 
  }

  async processSignalData(deviceData: DeviceData, deviceId: string) {
    const signalData = {
      deviceId: deviceId,
      time: deviceData.time,
      dataLength: deviceData.data.length,
    };
    this.create(signalData);
  }

  getAll(){
    return this.signalDataModel.find().batchSize(10).exec();
  }

  getOne(id: any) {
    return this.signalDataModel.findById(id).exec();
  }

  async update(id: string, updateData: any) {    
      const resource = await this.signalDataModel.findById(id).exec();
      if (!resource) {
        throw new NotFoundException('Resource not found');
      }
      Object.assign(resource, updateData);
      return resource.save();
    } 
  

  delete(id: string) {
    return this.signalDataModel.findByIdAndDelete(id);
  }


  async getFiltered(filters: any) {
    const query = this.signalDataModel.find();

    if (filters.time) {
      query.where('time').equals(filters.time);
    }
    return query.exec();
  }

}

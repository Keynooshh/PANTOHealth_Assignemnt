import { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { XrayData } from './xray.schema';
import { SignalsDataService } from 'src/signals/signals.service';
import { time } from 'console';
import { AppLogger } from '../AppLogger.service';

@Injectable()
export class XrayDataService {
  constructor(
    @InjectModel(XrayData.name)
    private readonly xrayDataModel: Model<XrayData>,
    private readonly signalDataService: SignalsDataService,
    private readonly logger: AppLogger,
  ) {
    logger.setContext(XrayDataService.name);
  }

  async create(xrayData: any) {
    try {
      const deviceId = Object.keys(xrayData)[0];
      const { data, time } = xrayData[deviceId];
      const ParsedData = data.map((entry) => {
        const [time, [x, y, speed]] = entry;
        return { time, coordinates: { x, y }, speed };
      });

      const createData = new this.xrayDataModel({
        deviceId: deviceId,
        time: time,
        data: ParsedData,
      }).save();

      this.logger.log('Saved XrayData in Mongo.');
      return createData;
    } catch (error) {
      this.logger.error(
        'Encounterd error while saving XrayData in Mongo:\n' + error.message,
      );
      return error.message;
    }
  }

  // a wrapper around processing signal.
  // Processing XrayData pipe.
  async processData(message: any) {
    const DeviceData = await this.create(message);
    this.signalDataService.processSignalData(DeviceData);
  }

  // should add pagination
  // for now, batchsize is just a precaustion
  getAll() {
    return this.xrayDataModel.find().batchSize(10).exec();
  }

  getOne(id: string) {
    return this.xrayDataModel.findById(id);
  }
}

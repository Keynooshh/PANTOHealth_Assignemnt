import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignalData } from './signals.schema';
import { Model } from 'mongoose';
import { XrayData } from 'src/xray/xray.schema';
import { AppLogger } from 'src/AppLogger.service';

@Injectable()
export class SignalsDataService {
  constructor(
    @InjectModel(SignalData.name)
    private readonly signalDataModel: Model<SignalData>,
    private readonly logger: AppLogger,
  ) {
    logger.setContext(SignalsDataService.name);
  }

  async create(signalData: any): Promise<SignalData> {
    try {
      this.logger.log('Added processed data SignalData into mongo.');
      return this.signalDataModel.create(signalData);
    } catch (error) {
      this.logger.error(
        'Encounterd error while saving SignalData in Mongo:\n' + error.message,
      );

      throw new HttpException(
        'Failed to create SignalData',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processSignalData(deviceData: XrayData) {
    // Time
    const times = deviceData.data.map((entry) => entry.time);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    //speed
    const speeds = deviceData.data.map((entry) => entry.speed);
    const avgSpeed =
      speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;

    //distance
    let totalDistance = 0;
    for (let i = 1; i < deviceData.data.length; i++) {
      const prev = deviceData.data[i - 1].coordinates;
      const curr = deviceData.data[i].coordinates;
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2),
      );
      totalDistance += distance;
    }

    //GeoData
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const entry of deviceData.data) {
      const x = entry.coordinates.x;
      const y = entry.coordinates.y;

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    const signalData = {
      deviceId: deviceData.deviceId,
      dataLength: deviceData.data.length,
      time: deviceData.time,
      timeRange: { minTime, maxTime },
      averageSpeed: avgSpeed,
      totalDistance: totalDistance,
      geoData: { minX, maxX, minY, maxY },
    };

    this.create(signalData);
  }

  getAll() {
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

    if (filters.deviceId) {
      query.where('deviceId').equals(filters.deviceId);
    }

    if (filters.dataLength) {
      query.where('dataLength').equals(filters.dataLength);
    }

    if (filters.time) {
      query.where('time').equals(filters.time);
    }

    if (filters.timeRange) {
      if (filters.timeRange.minTime) {
        query.where('timeRange.minTime').gte(filters.timeRange.minTime);
      }
      if (filters.timeRange.maxTime) {
        query.where('timeRange.maxTime').lte(filters.timeRange.maxTime);
      }
    }

    if (filters.geoData) {
      if (filters.geoData.minX) {
        query.where('geoData.minX').gte(filters.geoData.minX);
      }
      if (filters.geographicalBounds.maxX) {
        query.where('geoData.maxX').lte(filters.geoData.maxX);
      }
      if (filters.geographicalBounds.minY) {
        query.where('geoData.minY').gte(filters.geoData.minY);
      }
      if (filters.geographicalBounds.maxY) {
        query.where('geoData.maxY').lte(filters.geoData.maxY);
      }
    }

    return query.exec();
  }
}

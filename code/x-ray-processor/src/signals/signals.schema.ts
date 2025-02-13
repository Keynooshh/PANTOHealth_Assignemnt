import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class TimeRange {
  @Prop({ required: true })
  minTime: number;

  @Prop({ required: true })
  maxTime: number;
}

@Schema({ _id: false })
export class GeoData {
  @Prop({ required: true })
  minX: number;

  @Prop({ required: true })
  maxX: number;

  @Prop({ required: true })
  minY: number;

  @Prop({ required: true })
  maxY: number;
}

@Schema({ collection: 'signals' })
export class SignalData extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  time: number;

  @Prop({ type: TimeRange, required: true })
  timeRange: TimeRange;

  @Prop({ required: true })
  averageSpeed: number;

  @Prop({ required: true })
  totalDistance: number;

  @Prop({ type: GeoData, required: true })
  geoData: GeoData;
}

export const signalDataSchema = SchemaFactory.createForClass(SignalData);

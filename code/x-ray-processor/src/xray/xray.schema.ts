import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Location {
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;

  @Prop({ required: true })
  speed: number;
}

@Schema({ _id: false })
export class DataPoint {
  @Prop({ required: true })
  time: number;

  @Prop({ type: Location, required: true })
  location: Location;
}

@Schema({ _id: false })
export class DeviceData {
  @Prop({ type: [DataPoint], required: true })
  data: DataPoint[];

  @Prop({ required: true })
  time: number;
}

@Schema({ collection: 'x-ray-data' })
export class XrayData extends Document {
  @Prop({ type: Object, of: DeviceData, required: true })
  deviceId: Map<string, DeviceData>;
}

export const XrayDataSchema = SchemaFactory.createForClass(XrayData);

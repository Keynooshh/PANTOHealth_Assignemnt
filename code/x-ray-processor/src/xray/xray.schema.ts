import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Coordinates {
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;
}
@Schema({ _id: false })
export class DataPoint {
  @Prop({ required: true })
  time: number;

  @Prop({ type: Coordinates, required: true })
  coordinates: Coordinates;

  @Prop({ required: true })
  speed: number;
}

@Schema({ collection: 'x-ray-data' })
export class XrayData extends Document {
  @Prop({ type: [DataPoint], required: true })
  data: DataPoint[];

  @Prop({ required: true })
  time: number;

  @Prop({ required: true })
  deviceId: string;
}

export const XrayDataSchema = SchemaFactory.createForClass(XrayData);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'signals' })
export class SignalData extends Document {
  @Prop({ required: true })
  deviceId: string;

  @Prop({ required: true })
  dataLength: number;

  @Prop({ required: true })
  time: number;
}

export const signalDataSchema = SchemaFactory.createForClass(SignalData);

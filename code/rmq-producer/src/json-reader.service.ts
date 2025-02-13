import { Injectable } from "@nestjs/common";
import * as fs from 'fs';

@Injectable()
export class JsonReaderService{
    reader(inputPath:string) {
        const fileContent = fs.readFileSync(inputPath);
        const data = JSON.parse(fileContent.toString());
        return data;
    }
}
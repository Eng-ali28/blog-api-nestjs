import { Injectable, PipeTransform } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import * as sharp from 'sharp';
@Injectable()
export class SharpPipeImage implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<string> {
    if (!image) return;
    if (image.mimetype.split('/')[0] !== 'image')
      throw new BadRequestException('file must be image');
    const randomNumber = this.randomNum(1, 99999);
    let fileName = `${Date.now()}-${image.originalname}-${randomNumber}.webp`;
    await sharp(image.buffer)
      .resize(250, 250)
      .webp({ quality: 90 })
      .toFile(`./uploads/${fileName}`);
    return fileName;
  }
  randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
  }
}

export class SharpPipeImages implements PipeTransform {
  async transform(images: {
    imageCover: Express.Multer.File[];
    images: Express.Multer.File[];
  }) {
    if (!images.imageCover && !images.images) return;
    let arr = Object.keys(images);
    const randomNumber = this.randomNum(1, 99999);
    return await Promise.all(
      arr.map(async (ele: string, index: number) => {
        if (index == 0) {
          mkdirSync(`./uploads/${ele}`, { recursive: true });
          for (let i = 0; i < images[ele].length; i++) {
            let fileName = `${Date.now()}-${
              images[ele][i].originalname
            }-${randomNumber}.webp`;
            await this.getResize(
              images[ele][i].buffer,
              600,
              `uploads/${ele}/${fileName}`,
            );
            return { [ele]: `${ele}/${fileName}` };
          }
        } else {
          mkdirSync(`./uploads/${ele}`, { recursive: true });
          let arr = [];
          for (let i = 0; i < images[ele].length; i++) {
            let fileName = `${Date.now()}-${
              images[ele][i].originalname
            }-${randomNumber}.webp`;
            await this.getResize(
              images[ele][i].buffer,
              250,
              `uploads/${ele}/${fileName}`,
            );

            arr.push(`${ele}/${fileName}`);
          }
          return { [ele]: arr };
        }
      }),
    );
  }
  randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
  }
  async getResize(buffer: Buffer, size: number, path: string) {
    await sharp(buffer).resize(size, size).webp({ quality: 90 }).toFile(path);
  }
}

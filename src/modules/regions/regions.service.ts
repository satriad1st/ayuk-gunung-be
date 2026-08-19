import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { City, CityDocument } from './schemas/city.schema';
import { Province, ProvinceDocument } from './schemas/province.schema';

@Injectable()
export class RegionsService {
  constructor(
    @InjectModel(Province.name)
    private readonly provinceModel: Model<ProvinceDocument>,
    @InjectModel(City.name)
    private readonly cityModel: Model<CityDocument>,
  ) {}

  findProvinces() {
    return this.provinceModel.find().sort({ name: 1 }).exec();
  }

  findCitiesByProvince(provinceId: string) {
    if (!Types.ObjectId.isValid(provinceId)) {
      throw new NotFoundException('Province not found');
    }

    return this.cityModel
      .find({ province: new Types.ObjectId(provinceId) })
      .sort({ name: 1 })
      .exec();
  }

  async getProvince(id: string) {
    const province = await this.provinceModel.findById(id).exec();
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return province;
  }

  async getCityInProvince(cityId: string, provinceId: string) {
    const city = await this.cityModel.findById(cityId).exec();
    if (!city || city.province.toString() !== provinceId) {
      throw new NotFoundException('City not found in the selected province');
    }
    return city;
  }

  countProvinces() {
    return this.provinceModel.estimatedDocumentCount().exec();
  }

  insertProvinces(items: Array<Pick<Province, 'code' | 'name' | 'slug'>>) {
    return this.provinceModel.insertMany(items);
  }

  insertCities(
    items: Array<Pick<City, 'code' | 'name' | 'slug' | 'type' | 'province'>>,
  ) {
    return this.cityModel.insertMany(items);
  }
}

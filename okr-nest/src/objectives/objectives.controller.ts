import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import {ObjectiveReqDTO, ObjectiveResDTO, OkrsDTO} from './objectives.dto';

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get('/')
  fetchAll() {
    return this.objectivesService.fetchAll();
  }

  @Post('/')
  create(@Body() objective: ObjectiveReqDTO) {
    return this.objectivesService.create(objective);
  }

  @Delete('/')
  delete(@Body() objective: Omit<ObjectiveResDTO, 'objective'>) {
    return this.objectivesService.delete(objective);
  }

  @Patch('/')
  patch(@Body() objective: ObjectiveResDTO) {
    return this.objectivesService.patch(objective);
  }

  @Put('/')
  put(@Body() objective: OkrsDTO) {
    return this.objectivesService.put(objective);
  }
}

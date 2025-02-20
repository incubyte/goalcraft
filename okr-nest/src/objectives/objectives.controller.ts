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
import { ObjectiveReqDTO, OkrsDTO } from './ObjectiveDTO';

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get('/')
  fetchAll() {
    return this.objectivesService.fetchAll();
  }

  @Post('/')
  create(@Body() okrs: ObjectiveReqDTO) {
    return this.objectivesService.create(okrs);
  }

  @Delete('/')
  delete(@Body('objectiveId') objectiveId: string) {
    return this.objectivesService.delete(objectiveId);
  }

  @Patch('/')
  patch(@Body() okr: ObjectiveReqDTO & { id: string }) {
    return this.objectivesService.patch(okr);
  }

  @Put('/')
  put(@Body() okr: OkrsDTO) {
    return this.objectivesService.put(okr);
  }
}

import {Controller, Get, Query} from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Get("/")
  get(@Query() query: {objective: string, noOfKeyResultsWant: number}) {
    return this.ragService.get(query.objective, query.noOfKeyResultsWant);
  }
}

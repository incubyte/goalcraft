import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { KeyResultReqDTO, KeyResultResDTO } from 'src/key-results/keyResult.dto';
import { ObjectiveResDTO, OkrDTO } from 'src/objectives/objectives.dto';
import { v4 as uuidv4 } from 'uuid';

import { parsedOkrs } from '../parsedOkr.dto';

type csvRowType = {
  currentValue: string;
  initialValue: string;
  keyresultTitle: string;
  metrics: string;
  objective: string;
  targetValue: string;
};

@Injectable()
export class CsvHandlerService {
  parseCsvToOkr(files: Express.Multer.File[]): parsedOkrs[] {
    const result = files.map(file => {
      const { fileName, csvData } = this.parseFileToCsv(file);
      const okrsInJson: csvRowType[] = this.parseCsvToJson(csvData);
      const okrs: OkrDTO[] = this.parseJsonToOkrs(okrsInJson);
      return { parsedFile: fileName, parsedContent: okrs };
    });
    return result;
  }

  parseFileToCsv(file: Express.Multer.File): { fileName: string; csvData: string } {
    const result = { fileName: file.originalname, csvData: file.buffer.toString('utf-8') };
    return result;
  }

  parseCsvToJson(csvData: string): csvRowType[] {
    const okrsInJson: csvRowType[] = parse(csvData, {
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
    });
    return okrsInJson;
  }

  parseJsonToOkrs(okrsInJson: csvRowType[]): OkrDTO[] {
    const okrs: OkrDTO[] = [];

    function extractKeyResult(row: csvRowType, objectiveId: string): KeyResultReqDTO {
      return {
        title: row.keyresultTitle,
        initialValue: parseInt(row.initialValue),
        currentValue: parseInt(row.currentValue),
        targetValue: parseInt(row.targetValue),
        metric: row.metrics,
        objectiveId,
      };
    }
    function extractObjective(row: csvRowType): string {
      return row.objective;
    }

    let objectiveId: string = uuidv4();
    let parsedObjective: ObjectiveResDTO;
    let keyResults: KeyResultResDTO[] = [];
    okrsInJson.map((row, index) => {
      if ('' === row.objective) {
        const keyResult: KeyResultReqDTO = extractKeyResult(row, objectiveId);
        keyResults.push({
          ...keyResult,
          id: uuidv4(),
        });
      } else {
        if (parsedObjective) {
          const okr: OkrDTO = { ...parsedObjective, keyResults: keyResults };
          // console.log(okr);

          okrs.push({ ...okr });
          keyResults = [];
          objectiveId = uuidv4();
        }
        parsedObjective = { id: objectiveId, objective: extractObjective(row) };
        const keyResult: KeyResultReqDTO = extractKeyResult(row, objectiveId);
        keyResults.push({
          ...keyResult,
          id: uuidv4(),
        });
      }
      if (index === okrsInJson.length - 1) {
        okrs.push({ ...parsedObjective, keyResults });
      }
    });
    return okrs;
  }
}

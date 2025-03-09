import { Injectable } from '@nestjs/common';
import { parse } from 'csv-parse/sync';
import { json2csv } from 'json-2-csv';
import { KeyResultReqDTO } from 'src/key-results/keyResult.dto';
import { OkrDTO } from 'src/objectives/objectives.dto';
import { v4 as uuidv4 } from 'uuid';

import { ParsedOkrs } from '../parsedOkr.dto';

type UnformattedOkrType = {
  currentValue: string;
  initialValue: string;
  keyresultTitle: string;
  metric: string;
  objective: string;
  targetValue: string;
};

@Injectable()
export class CsvHandlerService {
  parseOkrsToCsv(okrs: OkrDTO[]): string {
    return json2csv(okrs, {
      expandArrayObjects: true,
      unwindArrays: true,
      keys: [
        { field: 'objective', title: 'Objective Title' },
        { field: 'keyResults.title', title: 'Key-Result Title' },
        { field: 'keyResults.initialValue', title: 'Initial Value' },
        { field: 'keyResults.currentValue', title: 'Current Value' },
        { field: 'keyResults.targetValue', title: 'Target Value' },
        { field: 'keyResults.metric', title: 'Metric' },
      ],
      emptyFieldValue: '',
    });
  }

  parseCsvToOkr(files: Express.Multer.File[]): ParsedOkrs[] {
    const result = files.map(file => {
      const { fileName, csvData } = this.parseFileToCsv(file);
      const unformattedOkrs: UnformattedOkrType[] = this.parseCsvToJson(csvData);
      const formattedOkrs: OkrDTO[] = this.assignKeyResultsToRespectiveOkr(unformattedOkrs);
      return { parsedFile: fileName, parsedContent: formattedOkrs };
    });
    return result;
  }

  private parseFileToCsv(file: Express.Multer.File): { fileName: string; csvData: string } {
    const result = { fileName: file.originalname, csvData: file.buffer.toString('utf-8') };
    return result;
  }

  private parseCsvToJson(csvData: string): UnformattedOkrType[] {
    const getInternalKeysValueForColumns = () => {
      return [
        'objective',
        'keyresultTitle',
        'initialValue',
        'currentValue',
        'targetValue',
        'metric',
      ];
    };

    const okrsInJson: UnformattedOkrType[] = parse(csvData, {
      delimiter: ',',
      columns: getInternalKeysValueForColumns,
      skip_empty_lines: true,
    });

    return okrsInJson;
  }

  private assignKeyResultsToRespectiveOkr(okrsInJson: UnformattedOkrType[]): OkrDTO[] {
    const sortFunction = (okr1: UnformattedOkrType, okr2: UnformattedOkrType) => {
      return okr1.objective.localeCompare(okr2.objective);
    };
    okrsInJson.sort(sortFunction);

    const extractKeyResult = (row: UnformattedOkrType, objectiveId: string): KeyResultReqDTO => {
      const keyResult = {
        title: row.keyresultTitle,
        initialValue: parseInt(row.initialValue),
        currentValue: parseInt(row.currentValue),
        targetValue: parseInt(row.targetValue),
        metric: row.metric,
        objectiveId,
      };

      return keyResult;
    };

    const extractObjectiveTitle = (row: UnformattedOkrType): string => {
      return row.objective;
    };

    const parsedOkrs: OkrDTO[] = [];
    let objectiveId: string = uuidv4();
    okrsInJson.map(row => {
      if (
        parsedOkrs.length === 0 ||
        parsedOkrs[parsedOkrs.length - 1].objective !== row.objective
      ) {
        const objective = extractObjectiveTitle(row);
        parsedOkrs.push({
          objective,
          id: objectiveId,
          keyResults: [],
        });
        objectiveId = uuidv4();
      }
      const recentObjective = parsedOkrs[parsedOkrs.length - 1];
      const keyResult = extractKeyResult(row, recentObjective.id);
      recentObjective.keyResults.push({ id: uuidv4(), ...keyResult });
    });
    return parsedOkrs;
  }
}

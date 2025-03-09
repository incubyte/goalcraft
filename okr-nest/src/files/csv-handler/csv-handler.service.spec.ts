import { Test, TestingModule } from '@nestjs/testing';
import { OkrDTO } from 'src/objectives/objectives.dto';
import { ParsedOkrs } from 'test/test-types';

import createMulterFile from '../../../test/utils/createMulterFile';
import { CsvHandlerService } from './csv-handler.service';

describe('CsvHandlerService', () => {
  let service: CsvHandlerService;
  let files: Express.Multer.File[];
  const fileName: string = 'testFile1.csv';
  const testFileDir = `test/files/${fileName}`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsvHandlerService],
    }).compile();

    service = module.get<CsvHandlerService>(CsvHandlerService);
    files = [createMulterFile(testFileDir)];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseCsvToOkrs method', () => {
    let parsedTestOkrs: ParsedOkrs[];
    beforeEach(() => {
      parsedTestOkrs = [
        {
          parsedFile: 'testFile1.csv',
          parsedContent: [
            {
              id: expect.any(String),
              objective: 'objective-1',
              keyResults: [
                {
                  id: expect.any(String),
                  title: 'Kr-1',
                  initialValue: 10,
                  currentValue: 12,
                  targetValue: 20,
                  metric: 'count',
                  objectiveId: expect.any(String),
                },
              ],
            },
          ],
        },
      ];
    });
    it('should parse Csv to Okrs in proper format', () => {
      const result: ParsedOkrs[] = service.parseCsvToOkr(files);

      expect(result).toEqual(parsedTestOkrs);
    });
  });

  describe('parseOkrsToCsv method', () => {
    it('should parse Okrs to Csv in proper format', () => {
      const okrs: OkrDTO[] = [
        {
          id: 'TEST_ID',
          objective: 'TEST_CSV_HANDLER_SERVICE',
          keyResults: [
            {
              id: 'TEST_KR_ID',
              title: 'TEST_KR',
              initialValue: 0,
              currentValue: 0,
              targetValue: 0,
              metric: 'TEST_METRIC',
              objectiveId: 'TEST_ID',
            },
          ],
        },
      ];
      const csvHeader = `Objective Title,Key-Result Title,Initial Value,Current Value,Target Value,Metric`;
      const okrsInCsv = `${csvHeader}\n${okrs[0].objective},${okrs[0].keyResults[0].title},${okrs[0].keyResults[0].initialValue},${okrs[0].keyResults[0].currentValue},${okrs[0].keyResults[0].targetValue},${okrs[0].keyResults[0].metric}`;

      const result = service.parseOkrsToCsv(okrs);
      expect(result).toBe(okrsInCsv);
    });
  });
});

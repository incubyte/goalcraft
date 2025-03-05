import { Test, TestingModule } from '@nestjs/testing';
import { parsedOkrs } from 'test/test-types';

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

  it('should parse csv to okrs', () => {
    const result: parsedOkrs[] = service.parseCsvToOkr(files);
    const expectedData: parsedOkrs[] = [
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

    expect(result).toEqual(expectedData);
  });
});

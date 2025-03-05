import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { parsedOkrs } from 'test/test-types';

import createMulterFile from '../../test/utils/createMulterFile';
import { CsvHandlerService } from './csv-handler/csv-handler.service';
import { FilesService } from './files.service';

describe('FilesService', () => {
  let service: FilesService;
  const csvService = mockDeep<CsvHandlerService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: CsvHandlerService,
          useValue: csvService,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile Method', () => {
    let files: Express.Multer.File[];
    const fileName: string = 'testFile1.csv';
    const testFileDir = `test/files/${fileName}`;

    beforeEach(() => {
      files = [createMulterFile(testFileDir)];
    });

    const mockedOutput: parsedOkrs[] = [
      {
        parsedFile: fileName,
        parsedContent: [
          {
            id: expect.any(String),
            objective: 'FILE_CONTROLLER',
            keyResults: [
              {
                title: 'FILE_CONTROLLER_KEYRESULT',
                initialValue: 100,
                currentValue: 120,
                targetValue: 200,
                metric: 'count',
                id: expect.any(String),
                objectiveId: expect.any(String),
              },
            ],
          },
        ],
      },
    ];

    it.skip('should accept only the defined (Express.Multer.Files[]) parameter type', () => {
      expect(() => service.uploadFile(files)).not.toThrow();
    });

    it('should call parseCsvToOkr and return the exact output', () => {
      csvService.parseCsvToOkr.mockReturnValue(mockedOutput);

      const result = service.uploadFile(files);

      expect(csvService.parseCsvToOkr).toHaveBeenCalled();
      expect(result).toEqual(mockedOutput);
    });
  });
});

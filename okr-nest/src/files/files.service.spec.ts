import { StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { Readable } from 'stream';
import { Okr, ParsedOkrs } from 'test/test-types';

import createMulterFile from '../../test/utils/createMulterFile';
import { ObjectivesService } from '../objectives/objectives.service';
import { CsvHandlerService } from './csv-handler/csv-handler.service';
import { FilesService } from './files.service';

describe('FilesService', () => {
  let service: FilesService;
  const mockCsvHandlerService = mockDeep<CsvHandlerService>();
  const mockObjectiveService = mockDeep<ObjectivesService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: CsvHandlerService,
          useValue: mockCsvHandlerService,
        },
        {
          provide: ObjectivesService,
          useValue: mockObjectiveService,
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

    const fakeParsedOkrs: ParsedOkrs[] = [
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

    it('should accept the defined (Express.Multer.Files[]) parameter type', () => {
      expect(() => service.uploadFile(files)).not.toThrow();
    });

    it('should call parseCsvToOkr of csv-handler.service and return the exact output', () => {
      mockCsvHandlerService.parseCsvToOkr.mockReturnValue(fakeParsedOkrs);

      const result = service.uploadFile(files);

      expect(mockCsvHandlerService.parseCsvToOkr).toHaveBeenCalled();
      expect(result).toEqual(fakeParsedOkrs);
    });
  });

  describe('downloadFile method', () => {
    it('should call parseOkrsToCsv of csv-handler.service and return the exact output', async () => {
      const fakeOkrs: Okr[] = [
        {
          id: 'FAKE_OKR_ID',
          objective: 'FAKE_OBJECTIVE',
          keyResults: [
            {
              id: 'fake_kr_id',
              title: 'file_service_test_kr',
              initialValue: 0,
              currentValue: 0,
              targetValue: 0,
              metric: 'test',
              objectiveId: 'FAKE_OKR_ID',
            },
          ],
        },
      ];
      mockObjectiveService.fetchAll.mockResolvedValue(fakeOkrs);

      const mockedCsvServiceResponse =
        'TEST_CSV_FILE_CONTENT,TEST_CSV_FILE_CONTENT,TEST_CSV_FILE_CONTENT';
      mockCsvHandlerService.parseOkrsToCsv.mockReturnValue(mockedCsvServiceResponse);

      const streamableFile = new StreamableFile(Readable.from(mockedCsvServiceResponse));
      const getContent = async (streamableFile: StreamableFile) => {
        (await streamableFile.getStream().toArray()).toString();
      };
      const expectedResponse = await getContent(streamableFile);

      const result = await service.downloadAllOkrs();

      expect(mockObjectiveService.fetchAll).toHaveBeenCalled();
      expect(mockCsvHandlerService.parseOkrsToCsv).toHaveBeenCalled();

      expect(await getContent(result)).toBe(expectedResponse);
    });
  });
});

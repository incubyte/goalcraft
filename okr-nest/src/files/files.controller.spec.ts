import { StreamableFile } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockDeep } from 'jest-mock-extended';
import { Readable } from 'stream';
import { ParsedOkrs } from 'test/test-types';

import createMulterFile from '../../test/utils/createMulterFile';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('FilesController', () => {
  let controller: FilesController;
  const testFileName: string = 'testFile1.csv';
  const testFileDir: string = 'C:/Developer/Internship/Pulled Apps/goalcraft/okr-nest/test/files';
  const filesService = mockDeep<FilesService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: filesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile method', () => {
    it('should call uploadFile method of file service and return the exact output', () => {
      const mockedResponse: ParsedOkrs[] = [
        {
          parsedFile: 'testFile1.csv',
          parsedContent: [
            {
              id: 'FILE_CONTROLLER_TEST',
              objective: 'Demo Objective',
              keyResults: [
                {
                  id: 'FILE_CONTROLLER_TEST_KR',
                  title: 'FILE_CONTROLLER_KEYRESULT',
                  initialValue: 100,
                  currentValue: 120,
                  targetValue: 200,
                  metric: 'count',
                  objectiveId: 'FILE_CONTROLLER_TEST',
                },
              ],
            },
          ],
        },
      ];
      const files: Express.Multer.File[] = [createMulterFile(`${testFileDir}/${testFileName}`)];
      filesService.uploadFile.mockReturnValue(mockedResponse);

      const result = controller.uploadFile(files);

      expect(filesService.uploadFile).toHaveBeenCalled();
      expect(result).toEqual(mockedResponse);
    });
  });

  describe('downloadFile method', () => {
    it('should call downloadFile method of file service and return the exact response', async () => {
      const mockedReturnValue = new StreamableFile(Readable.from('test csv'));
      filesService.downloadAllOkrs.mockResolvedValue(mockedReturnValue);

      const result = await controller.downloadAllOkrs();

      expect(result).toEqual(mockedReturnValue);
    });
  });
});

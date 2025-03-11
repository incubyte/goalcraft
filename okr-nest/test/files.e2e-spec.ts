import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'supertest';
import { Response } from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Filehandler', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaService = module.get(PrismaService);
  });

  describe('@POST /files/parse/', () => {
    let file_1_Buffer: Buffer;
    let file_2_Buffer: Buffer;
    let file_1_Name: string;
    let file_2_Name: string;
    const expectedParsedContentOfTestFile_1 = [
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
    ];

    const expectedParsedContentOfTestFile_2 = [
      {
        id: expect.any(String),
        objective: 'TEST_OBJECTIVE',
        keyResults: [
          {
            id: expect.any(String),
            title: 'kr-1',
            initialValue: 10,
            currentValue: 20,
            targetValue: 30,
            metric: 'count',
            objectiveId: expect.any(String),
          },
          {
            id: expect.any(String),
            title: 'kr-2',
            initialValue: 10,
            currentValue: 200,
            targetValue: 300,
            metric: 'count',
            objectiveId: expect.any(String),
          },
        ],
      },
      {
        id: expect.any(String),
        objective: 'TEST_OBJECTIVE_2',
        keyResults: [
          {
            id: expect.any(String),
            title: 'kr-3',
            initialValue: 10,
            currentValue: 200,
            targetValue: 300,
            metric: 'percentage',
            objectiveId: expect.any(String),
          },
        ],
      },
    ];

    beforeEach(() => {
      file_1_Name = 'testFile1.csv';
      file_2_Name = 'testFile2.csv';

      const file_1_Path: string = path.join(__dirname, 'files', file_1_Name);
      const file_2_Path: string = path.join(__dirname, 'files', file_2_Name);

      if (!fs.existsSync(file_1_Path)) {
        throw new Error(`File not found: ${file_1_Path}`);
      }

      file_1_Buffer = fs.readFileSync(file_1_Path); //brings the file to memory and solves the single '\' issue
      file_2_Buffer = fs.readFileSync(file_2_Path);
    });

    it('should parse csv file & return okrs in JSON format', async () => {
      const response: Response = await request(app.getHttpServer())
        .post('/files/parse')
        .set('Content-Type', 'multipart/form-data')
        .attach('files', file_1_Buffer, file_1_Name)
        .expect(201);

      expect(response.body).toEqual([
        {
          parsedFile: file_1_Name,
          parsedContent: expectedParsedContentOfTestFile_1,
        },
      ]);
    });

    it('should parse multiple csv file & return okrs in proper JSON format', async () => {
      const response: Response = await request(app.getHttpServer())
        .post('/files/parse')
        .set('Content-Type', 'multipart/form-data')
        .attach('files', file_1_Buffer, file_1_Name)
        .attach('files', file_2_Buffer, file_2_Name)
        .expect(201);

      expect(response.body).toEqual([
        {
          parsedFile: file_1_Name,
          parsedContent: expectedParsedContentOfTestFile_1,
        },
        {
          parsedFile: file_2_Name,
          parsedContent: expectedParsedContentOfTestFile_2,
        },
      ]);
    });
  });

  describe('@GET /files/download/ ', () => {
    beforeEach(async () => {
      await prismaService.keyResults.deleteMany();
      await prismaService.objectives.deleteMany();
    });

    it('should return all OKRs as a downloadable CSV file', async () => {
      const createdObjective = await prismaService.objectives.create({
        data: { objective: 'FILE_E2E_OBJECTIVE' },
      });

      const createdKeyResult = await prismaService.keyResults.create({
        data: {
          title: 'FILE_E2E_KR',
          initialValue: 10,
          currentValue: 20,
          targetValue: 20,
          metric: 'TEST_METRIC',
          objectiveId: createdObjective.id,
        },
      });
      const expectedResponse = `Objective Title,Key-Result Title,Initial Value,Current Value,Target Value,Metric\n${createdObjective.objective},${createdKeyResult.title},${createdKeyResult.initialValue},${createdKeyResult.currentValue},${createdKeyResult.targetValue},${createdKeyResult.metric}`;

      const response = await request(app.getHttpServer())
        .get('/files/download')
        .expect(200)
        .expect('Content-Type', /text\/csv/);

      expect(response.headers['content-disposition']).toContain('attachment; filename="okrs.csv"');

      const csvContent = JSON.stringify(response.text);
      expect(csvContent).toContain(JSON.stringify(expectedResponse));
    });
  });

  afterAll(async () => {
    await prismaService.objectives.deleteMany();
    await prismaService.keyResults.deleteMany();

    await app.close();
  });
});

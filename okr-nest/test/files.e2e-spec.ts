import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'supertest';
import { Response } from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';

describe('Filehandler', () => {
  let app: INestApplication<App>;
  let fileBuffer1: Buffer;
  let testFile1: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    testFile1 = 'testFile1.csv';
    const filePath1: string = path.join(__dirname, 'files', testFile1);
    if (!fs.existsSync(filePath1)) {
      throw new Error(`File not found: ${filePath1}`);
    }
    fileBuffer1 = fs.readFileSync(filePath1); //brings the file to memory and solves the single '\' issue
  });

  it('@POST /files/parse should parse csv & return okrs in JSON format', async () => {
    const expectedParsedContentOfTestFile1 = [
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

    const response: Response = await request(app.getHttpServer())
      .post('/files/parse')
      .set('Content-Type', 'multipart/form-data')
      .attach('files', fileBuffer1, testFile1)
      .expect(201);

    expect(response.body).toEqual([
      {
        parsedFile: testFile1,
        parsedContent: expectedParsedContentOfTestFile1,
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });
});

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
  let fileBuffer2: Buffer;
  let file1: string;
  let file2: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
    await app.init();

    file1 = 'testFile1.csv';
    file2 = 'testFile2.csv';
    const filePath1: string = path.join(__dirname, file1);
    const filePath2: string = path.join(__dirname, file2);
    if (!fs.existsSync(filePath1) || !fs.existsSync(filePath2)) {
      throw new Error(`File not found: ${filePath1}`);
    }
    fileBuffer1 = fs.readFileSync(filePath1); //brings the file to memory and solves the single '\' issue
    fileBuffer2 = fs.readFileSync(filePath2);
  });

  test('@POST /files/ should save files', async () => {
    const response: Response = await request(app.getHttpServer())
      .post('/files')
      .set('Content-Type', 'multipart/form-data')
      .attach('files', fileBuffer1, file1)
      .expect(201);
    const formattedResponse = JSON.stringify(response.body);
    expect(formattedResponse).toContain(
      JSON.stringify({ message: 'File saved successfully', filesSaved: [file1] })
    );
  });

  test('@POST /files/ should accept multiple files', async () => {
    const response: Response = await request(app.getHttpServer())
      .post('/files')
      .attach('files', fileBuffer1, file1)
      .attach('files', fileBuffer2, file2)
      .expect(201);

    const formattedResponse = JSON.stringify(response.body);
    expect(formattedResponse).toContain(
      JSON.stringify({ message: 'File saved successfully', filesSaved: [file1, file2] })
    );
  });

  afterAll(async () => {
    await app.close();
  });
});

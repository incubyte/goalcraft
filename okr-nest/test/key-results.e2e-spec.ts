import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { KeyResult, Objective } from './test-types';
import { Response } from 'supertest';

describe('KeyResults Integration', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let objectiveToInsert: Omit<Objective, 'id'>;
  let keyResultToInsert: Omit<KeyResult, 'id'>;
  let insertedObjective: Objective;
  let insertedKeyResult: KeyResult;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.keyResults.deleteMany();
    await prismaService.objectives.deleteMany();

    objectiveToInsert = { objective: 'Test 1' };
    insertedObjective = await prismaService.objectives.create({
      data: objectiveToInsert,
    });

    keyResultToInsert = {
      title: 'Key Result 1',
      initialValue: 0,
      currentValue: 5,
      targetValue: 10,
      metric: 'metric 1',
      objectiveId: insertedObjective.id,
    };
    insertedKeyResult = await prismaService.keyResults.create({
      data: keyResultToInsert,
    });
  });

  describe('@Post /key-results/', () => {
    it('should create key-results with given details', async () => {
      const response: Response = await request(app.getHttpServer())
        .post(`/key-results/`)
        .send([keyResultToInsert])
        .expect(201);

      expect(response.body).toEqual([
        { ...keyResultToInsert, id: response.body[0].id },
      ]);
    });
  });

  describe('@Get /objectives?keyResultId', () => {
    it('should returns key-results', async () => {
      const response: Response = await request(app.getHttpServer())
        .get(`/objectives?keyResultId=${insertedKeyResult.id}`)
        .expect(200);

      expect(response.body[0].keyResults[0]).toEqual(insertedKeyResult);
    });
  });

  describe('@Patch /key-results/', () => {
    it('should update key-results with given data', async () => {
      const keyResultToUpdate: KeyResult = {
        ...insertedKeyResult,
        currentValue: 10,
      };

      const response: Response = await request(app.getHttpServer())
        .patch(`/key-results/`)
        .send(keyResultToUpdate)
        .expect(200);

      expect(response.body).toEqual(keyResultToUpdate);
    });
  });

  describe('@Delete /key-results/', () => {
    it('should delete key-results of given id ', async () => {
      const response: Response = await request(app.getHttpServer())
        .delete(`/key-results/`)
        .send({ id: insertedKeyResult.id })
        .expect(200);

      expect(response.body).toEqual(insertedKeyResult);
    });
  });

  describe('@Get /key-results/:id/progress', () => {
    it('should get progress of key-results with given id', async () => {
      const response: Response = await request(app.getHttpServer())
        .get(`/key-results/${insertedKeyResult.id}/progress`)
        .expect(200);

      expect(response.body.percentage).toBe(50);
    });
  });
});

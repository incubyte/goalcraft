import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { PrismaService } from '../src/prisma/prisma.service';
import { ObjectiveReqDTO } from '../src/objectives/ObjectiveDTO';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { KeyResultReqDTO } from '../src/key-results/keyResultDTO';
import { Objective } from './test-types';

describe('KeyResults Integration', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let objective: Omit<Objective, 'id'>;
  let objectiveToBeInserted: Objective;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get<PrismaService>(PrismaService);
    objective = { objective: 'Test 1' };
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prismaService.keyResults.deleteMany();
    await prismaService.objectives.deleteMany();

    objectiveToBeInserted = await prismaService.objectives.create({
      data: objective,
    });
  });

  describe('@Post /key-results/', () => {
    it('should create key-results with given details', async () => {
      let keyResult: KeyResultReqDTO = {
        title: 'Key Result 1',
        initialValue: 10,
        currentValue: 20,
        targetValue: 30,
        metric: 'metric 1',
        objectiveId: objectiveToBeInserted.id,
      };

      const response = await request(app.getHttpServer())
        .post(`/key-results/`)
        .send([keyResult])
        .expect(201);
      expect(response.body.length).toBe(1);
    });
  });

  describe('@Get /key-results/', () => {
    it('should returns key-results', async () => {
      let keyResult: KeyResultReqDTO = {
        title: 'Key Result 1',
        initialValue: 10,
        currentValue: 20,
        targetValue: 30,
        metric: 'metric 1',
        objectiveId: objectiveToBeInserted.id,
      };
      const keyResultsToBeCreated = await prismaService.keyResults.create({
        data: keyResult,
      });

      const response = await request(app.getHttpServer())
        .get(`/objectives?keyResultId=${keyResultsToBeCreated.id}`)
        .expect(200);
      expect(response.body[0].keyResults[0]).toEqual(keyResultsToBeCreated);
    });
  });

  describe('@Patch /key-results/', () => {
    it('should update key-results with given data', async () => {
      let keyResult: KeyResultReqDTO = {
        title: 'Key Result 1',
        initialValue: 10,
        currentValue: 20,
        targetValue: 30,
        metric: 'metric 1',
        objectiveId: objectiveToBeInserted.id,
      };

      const keyResultsToBeCreated = await prismaService.keyResults.create({
        data: keyResult,
      });

      const keyResultsToBeUpdated = {
        title: 'Updated Key Result 2',
        initialValue: 20,
        currentValue: 30,
        targetValue: 40,
        metric: 'metric 2',
        objectiveId: objectiveToBeInserted.id,
        id: keyResultsToBeCreated.id,
      };
      const response = await request(app.getHttpServer())
        .patch(`/key-results/`)
        .send(keyResultsToBeUpdated)
        .expect(200);
      expect(response.body).toEqual(keyResultsToBeUpdated);
    });
  });

  describe('@Delete /key-results/', () => {
    it('should delete key-results of given id ', async () => {
      let keyResult: KeyResultReqDTO = {
        title: 'Key Result 1',
        initialValue: 10,
        currentValue: 20,
        targetValue: 30,
        metric: 'metric 1',
        objectiveId: objectiveToBeInserted.id,
      };

      const keyResultsToBeCreated = await prismaService.keyResults.create({
        data: keyResult,
      });

      const response = await request(app.getHttpServer())
        .delete(`/key-results/`)
        .send({ id: keyResultsToBeCreated.id })
        .expect(200);
      expect(response.body).toEqual({
        id: keyResultsToBeCreated.id,
        ...keyResult,
      });
    });
  });

  describe('@Get /key-results/:id/progress', () => {
    it('should get progress of key-results with given id', async () => {
      let keyResult = {
        title: 'Key Result Progress',
        initialValue: 0,
        currentValue: 5,
        targetValue: 10,
        metric: '%',
        objectiveId: objectiveToBeInserted.id,
      };
      const keyResultResponse = await request(app.getHttpServer())
        .post(`/key-results/`)
        .send([keyResult])
        .expect(201);
      let keyResultId = keyResultResponse.body[0].id;

      // act
      const response = await request(app.getHttpServer())
        .get(`/key-results/${keyResultId}/progress`)
        .expect(200);

      // assert
      const body = response.body;
      expect(body.percentage).toBeDefined();
      expect(body.percentage).toBe(50);
    });
  });
});

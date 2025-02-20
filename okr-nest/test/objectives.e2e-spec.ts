import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { ObjectiveReqDTO } from '../src/objectives/ObjectiveDTO';

describe('Objective Integration', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let objective: ObjectiveReqDTO = { objective: 'test 1' };

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
  });

  describe('@Get /Objectives/', () => {
    it('should returns objectives', async () => {
      const createdObjective = await prismaService.objectives.create({
        data: objective,
      });
      const createdObjectiveId = createdObjective.id;

      const response = await request(app.getHttpServer())
        .get('/objectives')
        .expect(200);

      expect(response.body).toEqual([
        { ...objective, id: createdObjectiveId, keyResults: [] },
      ]);
      expect(response.body.length).toBe(1);
    });
  });

  describe('@Delete /Objectives/', () => {
    it('should delete objective of given id ', async () => {
      const createdObjective = await prismaService.objectives.create({
        data: objective,
      });
      const createdObjectiveId = createdObjective.id;

      const response = await request(app.getHttpServer())
        .delete(`/objectives`)
        .send({ objectiveId: createdObjectiveId })
        .expect(200);

      expect(response.body).toEqual({ ...objective, id: createdObjectiveId });
    });
  });

  describe('@Post /Objectives/', () => {
    it('should create objective with given types', async () => {
      const response = await request(app.getHttpServer())
        .post('/objectives/')
        .send(objective);

      expect(response.body).toEqual({ ...objective, id: response.body.id });
    });
  });

  describe('@Patch /Objectives/', () => {
    it('should update objective title of given objectiveId', async () => {
      const createdObjective = await prismaService.objectives.create({
        data: objective,
      });
      const createdObjectiveId = createdObjective.id;

      const objectiveToBeUpdated = {
        id: createdObjectiveId,
        objective: 'test 2',
      };
      const response = await request(app.getHttpServer())
        .patch(`/objectives`)
        .send(objectiveToBeUpdated)
        .expect(200);
      expect(response.body).toEqual(objectiveToBeUpdated);
    });
  });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Response } from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Objective } from './test-types';

describe('Objective Integration', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let objectiveToInsert: Omit<Objective, 'id'>;
  let insertedObjective: Objective;

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
  });

  describe('@Post /Objectives/', () => {
    it('should create objective with given types', async () => {
      const response: Response = await request(app.getHttpServer())
        .post('/objectives/')
        .send(objectiveToInsert);

      expect(response.body).toEqual({
        ...objectiveToInsert,
        id: response.body.id,
      });
    });
  });

  describe('@Get /Objectives/', () => {
    it('should returns objectives', async () => {
      const response: Response = await request(app.getHttpServer()).get('/objectives').expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body).toEqual([{ ...insertedObjective, keyResults: [] }]);
    });
  });

  describe('@Patch /Objectives/', () => {
    it('should update objective title of given objectiveId', async () => {
      const objectiveToBeUpdated = {
        id: insertedObjective.id,
        objective: 'Test 2',
      };

      const response: Response = await request(app.getHttpServer())
        .patch('/objectives')
        .send(objectiveToBeUpdated)
        .expect(200);

      expect(response.body).toEqual(objectiveToBeUpdated);
    });
  });

  describe('@Delete /Objectives/', () => {
    it('should delete objective of given id ', async () => {
      const response: Response = await request(app.getHttpServer())
        .delete(`/objectives`)
        .send({ id: insertedObjective.id })
        .expect(200);

      expect(response.body).toEqual(insertedObjective);
    });
  });
});

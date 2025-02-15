import {INestApplication} from "@nestjs/common";
import {App} from "supertest/types";
import {PrismaService} from "../src/prisma/prisma.service";
import {ObjectiveReqDTO} from "../src/objectives/ObjectiveDTO";
import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import * as request from "supertest";
import {KeyResultReqDTO} from "../src/key-results/keyResultDTO";

describe('KeyResults Integration', () => {
    let app: INestApplication<App>;
    let prismaService: PrismaService;
    let objective: ObjectiveReqDTO = {objective: 'test 1'};

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
    })

    beforeEach(async () => {
        await prismaService.keyResults.deleteMany();
        await prismaService.objectives.deleteMany();
    })

    describe('@Get /key-results/', () => {
        it('should returns key-results', async () => {
            const objectiveToBeCreated = await prismaService.objectives.create({data: objective});
            let keyResult: KeyResultReqDTO = {
                title: "Key Result 1",
                initialValue: 10,
                currentValue: 20,
                targetValue: 30,
                metric: "metric 1",
                objectiveId: objectiveToBeCreated.id,
            };
            const keyResultsToBeCreated = await prismaService.keyResults.create({data: keyResult});

            const response = await request(app.getHttpServer()).get(`/objectives?keyResultId=${keyResultsToBeCreated.id}`).expect(200);
            expect(response.body[0].keyResults[0]).toEqual(keyResultsToBeCreated);
        })
    })

    describe('@Delete /key-results/', () => {
        it('should delete key-results of given id ', async () => {
            const objectiveToBeCreated = await prismaService.objectives.create({data: objective});
            let keyResult: KeyResultReqDTO = {
                title: "Key Result 1",
                initialValue: 10,
                currentValue: 20,
                targetValue: 30,
                metric: "metric 1",
                objectiveId: objectiveToBeCreated.id,
            };

            const keyResultsToBeCreated = await prismaService.keyResults.create({data: keyResult});

            const response = await request(app.getHttpServer()).delete(`/key-results/`).send({id: keyResultsToBeCreated.id}).expect(200);
            expect(response.body).toEqual({id: keyResultsToBeCreated.id, ...keyResult});
        })
    })

    describe('@Post /key-results/', () => {
        it('should create key-results with given details', async () => {
            const objectiveToBeCreated = await prismaService.objectives.create({data: objective});
            let keyResult: KeyResultReqDTO = {
                title: "Key Result 1",
                initialValue: 10,
                currentValue: 20,
                targetValue: 30,
                metric: "metric 1",
                objectiveId: objectiveToBeCreated.id,
            };

            const response = await request(app.getHttpServer()).post(`/key-results/`).send([keyResult]).expect(201);
            expect(response.body.length).toBe(1);
        })
    })

    describe("@Patch /key-results/", () => {
        it('should update key-results with given data', async () => {
            const objectiveToBeCreated = await prismaService.objectives.create({data: objective});
            let keyResult: KeyResultReqDTO = {
                title: "Key Result 1",
                initialValue: 10,
                currentValue: 20,
                targetValue: 30,
                metric: "metric 1",
                objectiveId: objectiveToBeCreated.id,
            };

            const keyResultsToBeCreated = await prismaService.keyResults.create({data: keyResult});

            const keyResultsToBeUpdated = {
                title: "Updated Key Result 2",
                initialValue: 20,
                currentValue: 30,
                targetValue: 40,
                metric: "metric 2",
                objectiveId: objectiveToBeCreated.id,
                id: keyResultsToBeCreated.id
            }
            const response = await request(app.getHttpServer()).patch(`/key-results/`).send(keyResultsToBeUpdated).expect(200);
            expect(response.body).toEqual(keyResultsToBeUpdated);
        });
    })

    describe("@Get /key-results/:id/progress", () => {
        it("should get progress of key-results with given id", async () => {
            // arrange
            const objectiveToBeCreated = await prismaService.objectives.create({data: objective});
            let keyResult = {
                title: "Key Result Progress",
                initialValue: 0,
                currentValue: 5,
                targetValue: 10,
                metric: "%",
                objectiveId: objectiveToBeCreated.id,
            };
            const keyResultResponse = await request(app.getHttpServer()).post(`/key-results/`).send([keyResult]).expect(201);
            let keyResultId = keyResultResponse.body[0].id;

            // act
            const response = await request(app.getHttpServer()).get(`/key-results/${keyResultId}/progress`).expect(200);

            // assert
            const body = response.body;
            expect(body.percentage).toBeDefined();
            expect(body.percentage).toBe(50);
        })
    })
})
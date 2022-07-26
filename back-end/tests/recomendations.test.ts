import supertest from "supertest"

import app from "../src/app.js"
import { prisma } from "../src/database.js"
import { createNewRecomendation } from "./factories/recomendationsFactory.js"
import {
	createScnearioAlreadyExistsRecomendation,
	deleteAllData,
} from "./factories/scnearioFactory.js"

const agent = supertest(app)

beforeEach(async () => {
	await deleteAllData()
})

describe("POST recomendations", () => {
	it("should create a new recomendation", async () => {
		const recomendationData = createNewRecomendation()
		const response = await agent
			.post("/recommendations")
			.send(recomendationData)
		expect(response.status).toBe(201)
		const recomendationCreated = await prisma.recommendation.findUnique({
			where: { name: recomendationData.name },
		})
		expect(recomendationCreated).toBeDefined()
	})
	it("should not create a new recommendation if it already exists", async () => {
		const recomendationData =
			await createScnearioAlreadyExistsRecomendation()
		const response = await agent
			.post("/recomendations")
			.send(recomendationData)
		expect(response.status).toBe(409)
		const recomendationCreated = await prisma.recommendation.findMany({
			where: { name: recomendationData.name },
		})
		expect(recomendationCreated).toHaveLength(1)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recomendationData = createNewRecomendation()
		delete recomendationData.name
		const response = await agent
			.post("/recommendations")
			.send(recomendationData)
		expect(response.status).toBe(422)
		const recomendationCreated = await prisma.recommendation.findMany({
			where: { name: recomendationData.name },
		})
		expect(recomendationCreated).toHaveLength(0)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recomendationData = createNewRecomendation()
		delete recomendationData.youtubeLink
		const response = await agent
			.post("/recommendations")
			.send(recomendationData)
		expect(response.status).toBe(422)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recomendationData = createNewRecomendation()
		const response = await agent
			.post("/recommendations")
			.send({ ...recomendationData, invalid: "invalid" })
		expect(response.status).toBe(422)
		const recomendationCreated = await prisma.recommendation.findMany({
			where: { name: recomendationData.name },
		})
		expect(recomendationCreated).toHaveLength(0)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recomendationData = undefined
		const response = await agent
			.post("/recommendations")
			.send(recomendationData)
		expect(response.status).toBe(422)
	})
})

afterAll(async () => {
	await prisma.$disconnect()
})

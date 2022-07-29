import supertest from "supertest"

import app from "../../src/app.js"
import prisma from "../../src/database.js"
import { createNewRecomendation } from "./factories/recomendationsFactory.js"
import {
	createScnearioAlreadyExistsRecommendation,
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
		const { name, youtubeLink } =
			await createScnearioAlreadyExistsRecommendation()
		const response = await agent
			.post("/recommendations")
			.send({ name, youtubeLink })
		expect(response.status).toBe(409)
		const recomendationCreated = await prisma.recommendation.findMany({
			where: { name },
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
	it("should not create a new recommendation and return status code 422", async () => {
		const recomendationData = createNewRecomendation()
		recomendationData.youtubeLink = "invalid"
		const response = await agent
			.post("/recommendations")
			.send(recomendationData)
		expect(response.status).toBe(422)
	})
})

describe("POST upvote", () => {
	it("should upvote a recomendation", async () => {
		const { id } = await createScnearioAlreadyExistsRecommendation()
		const response = await agent.post(`/recommendations/${id}/upvote`)
		const recomendation = await prisma.recommendation.findUnique({
			where: { id },
		})
		expect(recomendation.score).toBe(1)
		expect(response.status).toBe(200)
	})
	it("should not upvote a recomendation if it does not exist", async () => {
		const response = await agent.post("/recommendations/123/upvote")
		expect(response.status).toBe(404)
	})
})

describe("POST downvote", () => {
	it("should downvote a recomendation", async () => {
		const { id } = await createScnearioAlreadyExistsRecommendation()
		const response = await agent.post(`/recommendations/${id}/downvote`)
		const recomendation = await prisma.recommendation.findUnique({
			where: { id },
		})
		expect(recomendation.score).toBe(-1)
		expect(response.status).toBe(200)
	})
	it("should not downvote a recomendation if it does not exist", async () => {
		const response = await agent.post("/recommendations/123/downvote")
		expect(response.status).toBe(404)
	})
	it("must remove a recommendation if the score is less than -5", async () => {
		const { id } = await createScnearioAlreadyExistsRecommendation(-6)
		const response = await agent.post(`/recommendations/${id}/downvote`)
		const recomendation = await prisma.recommendation.findUnique({
			where: { id },
		})
		expect(recomendation).toBeNull()
		expect(response.status).toBe(200)
	})
})
afterAll(async () => {
	await prisma.$disconnect()
})

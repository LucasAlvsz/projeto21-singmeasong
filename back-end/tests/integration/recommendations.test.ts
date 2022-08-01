import supertest from "supertest"

import app from "../../src/app.js"
import prisma from "../../src/database.js"
import { createNewRecommendation } from "./factories/recommendationsFactory.js"
import {
	createScnearioAlreadyExistsRecommendation,
	deleteAllData,
} from "./factories/scnearioFactory.js"

const agent = supertest(app)

beforeEach(async () => {
	await deleteAllData()
})

describe("POST recommendations", () => {
	it("should create a new recommendation", async () => {
		const recommendationData = createNewRecommendation()
		const response = await agent
			.post("/recommendations")
			.send(recommendationData)
		expect(response.status).toBe(201)
		const recommendationCreated = await prisma.recommendation.findUnique({
			where: { name: recommendationData.name },
		})
		expect(recommendationCreated).toBeDefined()
	})
	it("should not create a new recommendation if it already exists", async () => {
		const recommendation = await createScnearioAlreadyExistsRecommendation()
		const { name, youtubeLink } = recommendation[0]
		const response = await agent
			.post("/recommendations")
			.send({ name, youtubeLink })
		expect(response.status).toBe(409)
		const recommendationCreated = await prisma.recommendation.findMany({
			where: { name },
		})
		expect(recommendationCreated).toHaveLength(1)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recommendationData = createNewRecommendation()
		delete recommendationData.name
		const response = await agent
			.post("/recommendations")
			.send(recommendationData)
		expect(response.status).toBe(422)
		const recommendationCreated = await prisma.recommendation.findMany({
			where: { name: recommendationData.name },
		})
		expect(recommendationCreated).toHaveLength(0)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recommendationData = createNewRecommendation()
		delete recommendationData.youtubeLink
		const response = await agent
			.post("/recommendations")
			.send(recommendationData)
		expect(response.status).toBe(422)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recommendationData = createNewRecommendation()
		const response = await agent
			.post("/recommendations")
			.send({ ...recommendationData, invalid: "invalid" })
		expect(response.status).toBe(422)
		const recommendationCreated = await prisma.recommendation.findMany({
			where: { name: recommendationData.name },
		})
		expect(recommendationCreated).toHaveLength(0)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recommendationData = undefined
		const response = await agent
			.post("/recommendations")
			.send(recommendationData)
		expect(response.status).toBe(422)
	})
	it("should not create a new recommendation and return status code 422", async () => {
		const recommendationData = createNewRecommendation()
		recommendationData.youtubeLink = "invalid"
		const response = await agent
			.post("/recommendations")
			.send(recommendationData)
		expect(response.status).toBe(422)
	})
})

describe("POST upvote", () => {
	it("should upvote a recommendation", async () => {
		const recommendationData =
			await createScnearioAlreadyExistsRecommendation()
		const { id } = recommendationData[0]
		const response = await agent.post(`/recommendations/${id}/upvote`)
		const recommendation = await prisma.recommendation.findUnique({
			where: { id },
		})
		expect(recommendation.score).toBe(1)
		expect(response.status).toBe(200)
	})
	it("should not upvote a recommendation if it does not exist", async () => {
		const response = await agent.post("/recommendations/123/upvote")
		expect(response.status).toBe(404)
	})
})

describe("POST downvote", () => {
	it("should downvote a recommendation", async () => {
		const recommendationData =
			await createScnearioAlreadyExistsRecommendation()
		const { id } = recommendationData[0]
		const response = await agent.post(`/recommendations/${id}/downvote`)
		const recommendation = await prisma.recommendation.findUnique({
			where: { id },
		})
		expect(recommendation.score).toBe(-1)
		expect(response.status).toBe(200)
	})
	it("should not downvote a recommendation if it does not exist", async () => {
		const response = await agent.post("/recommendations/123/downvote")
		expect(response.status).toBe(404)
	})
	it("must remove a recommendation if the score is less than -5", async () => {
		const recommendationData =
			await createScnearioAlreadyExistsRecommendation(1, -6)
		const { id } = recommendationData[0]
		const response = await agent.post(`/recommendations/${id}/downvote`)
		const recommendation = await prisma.recommendation.findUnique({
			where: { id },
		})
		expect(recommendation).toBeNull()
		expect(response.status).toBe(200)
	})
})

describe("GET recommendations", () => {
	it("should return a list with 10 recommendations", async () => {
		await createScnearioAlreadyExistsRecommendation(11)
		const response = await agent.get("/recommendations")
		expect(response.status).toBe(200)
		expect(response.body).toHaveLength(10)
	})
	it("should return an empty list if no recommendations", async () => {
		const response = await agent.get("/recommendations")
		expect(response.status).toBe(200)
		expect(response.body).toEqual([])
	})
	describe("GET recommendations by id", () => {
		it("should return a recommendation by id", async () => {
			const recommendationData =
				await createScnearioAlreadyExistsRecommendation(2)
			const { id } = recommendationData[0]
			const response = await agent.get(`/recommendations/${id}`)
			expect(response.status).toBe(200)
			expect(response.body).toEqual(recommendationData[0])
		})
		it("should not return a recommendation if id does not exist", async () => {
			const response = await agent.get("/recommendations/123")
			expect(response.status).toBe(404)
		})
	})
	describe("GET random recommendations", () => {
		it("should return a random recommendation", async () => {
			const recommendationData =
				await createScnearioAlreadyExistsRecommendation(1)
			const response = await agent.get("/recommendations/random")
			expect(response.status).toBe(200)
			expect(response.body).toEqual(recommendationData[0])
		})
		it("should not return a recommendation if none exists", async () => {
			const response = await agent.get("/recommendations/random")
			expect(response.status).toBe(404)
		})
	})
	describe("GET top recommendations", () => {
		it("should return a list of top recommendations", async () => {
			await createScnearioAlreadyExistsRecommendation(10, 200)
			await createScnearioAlreadyExistsRecommendation(10, 100)

			const response = await agent.get("/recommendations/top/10")
			expect(response.status).toBe(200)
			expect(response.body).toHaveLength(10)
			expect(response.body).not.toHaveProperty("score", 100)
		})
		it("should return an empty list of top recommendations if none exist", async () => {
			const response = await agent.get("/recommendations/top/10")
			expect(response.status).toBe(200)
			expect(response.body).toEqual([])
		})
	})
})

afterAll(async () => {
	await prisma.$disconnect()
})

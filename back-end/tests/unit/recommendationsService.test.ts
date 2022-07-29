import { recommendationRepository } from "../../src/repositories/recommendationRepository"
import { recommendationService } from "../../src/services/recommendationsService"
import {
	createAmount,
	createId,
	createRecommendationBody,
	createRecommendationData,
} from "./factories/recommendationServiceFactory"

describe("recommendation service test suite", () => {
	describe("Create a new recommendation", () => {
		it("should create a new recommendation", async () => {
			jest.spyOn(
				recommendationRepository,
				"findByName"
			).mockResolvedValueOnce(null)
			jest.spyOn(
				recommendationRepository,
				"create"
			).mockResolvedValueOnce(null)

			const recommendationBody = createRecommendationBody()
			await recommendationService.insert(recommendationBody)
			expect(recommendationRepository.findByName).toBeCalled()
			expect(recommendationRepository.create).toBeCalled()
		})
		it("should not create a new recommendation if it already exists", async () => {
			jest.spyOn(
				recommendationRepository,
				"findByName"
			).mockResolvedValueOnce(true as any)

			const recommendationBody = createRecommendationBody()
			const promise = recommendationService.insert(recommendationBody)
			expect(promise).rejects.toHaveProperty("type", "conflict")
		})
	})
	describe("Upvote a recommendation", () => {
		it("should upvote the existing recommendation", async () => {
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				true as any
			)
			jest.spyOn(
				recommendationRepository,
				"updateScore"
			).mockResolvedValueOnce(null)

			await recommendationService.upvote(createId())
			expect(recommendationRepository.find).toBeCalled()
			expect(recommendationRepository.updateScore).toBeCalled()
		})
		it("should not upvote a recommendation if the recommendation id does not exist", () => {
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				false as any
			)
			const promise = recommendationService.upvote(createId())
			expect(promise).rejects.toHaveProperty("type", "not_found")
		})
	})
	describe("Downvote a recommendation", () => {
		it("should downvote the existing recommendation", async () => {
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				true as any
			)
			jest.spyOn(
				recommendationRepository,
				"updateScore"
			).mockResolvedValueOnce(1 as any)
			jest.spyOn(
				recommendationRepository,
				"remove"
			).mockResolvedValueOnce(null)

			await recommendationService.downvote(createId())
			expect(recommendationRepository.find).toBeCalled()
			expect(recommendationRepository.updateScore).toBeCalled()
			expect(recommendationRepository.remove).not.toBeCalled()
		})
		it("should not downvote a recommendation if the recommendation id does not exist", () => {
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				false as any
			)
			const promise = recommendationService.downvote(createId())
			expect(promise).rejects.toHaveProperty("type", "not_found")
		})
		it("should downvote and remove the existing recommendation", async () => {
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				true as any
			)
			jest.spyOn(
				recommendationRepository,
				"updateScore"
			).mockResolvedValueOnce({ score: -6 } as any)
			jest.spyOn(
				recommendationRepository,
				"remove"
			).mockResolvedValueOnce(null)

			await recommendationService.downvote(createId())
			expect(recommendationRepository.find).toBeCalled()
			expect(recommendationRepository.updateScore).toBeCalled()
			expect(recommendationRepository.remove).toBeCalled()
		})
	})
	describe("Get recommendation by id", () => {
		it("should return a recommendation if id is valid", async () => {
			const recommendation = createRecommendationData()
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				recommendation
			)
			const result = await recommendationService.getById(createId())
			expect(result).toEqual(recommendation)
		})
		it("should not return a recommendation if id is invalid", async () => {
			jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(
				null
			)
			const promise = recommendationService.getById(createId())
			expect(promise).rejects.toHaveProperty("type", "not_found")
		})
	})
	describe("Get all recommendations", () => {
		it("should return a list of recommendations", async () => {
			const recommendations = [
				createRecommendationData(),
				createRecommendationData(),
			]
			jest.spyOn(
				recommendationRepository,
				"findAll"
			).mockResolvedValueOnce(recommendations)
			const result = await recommendationService.get()
			expect(result).toEqual(recommendations)
		})
	})
	describe("Get top recommendations", () => {
		it("should return a list of top recommendations", async () => {
			const recommendations = [
				createRecommendationData(),
				createRecommendationData(),
			]
			jest.spyOn(
				recommendationRepository,
				"getAmountByScore"
			).mockResolvedValueOnce(recommendations)
			const result = await recommendationService.getTop(2)
			expect(result).toEqual(recommendations)
		})
	})
})

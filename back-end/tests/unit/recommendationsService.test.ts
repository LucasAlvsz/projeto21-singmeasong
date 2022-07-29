import { faker } from "@faker-js/faker"
import { recommendationRepository } from "../../src/repositories/recommendationRepository"
import { recommendationService } from "../../src/services/recommendationsService"
import {
	createId,
	createRecommendationData,
} from "./factories/recommendationFactory"

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

			const recommendationData = createRecommendationData()
			await recommendationService.insert(recommendationData)
			expect(recommendationRepository.findByName).toBeCalled()
			expect(recommendationRepository.create).toBeCalled()
		})
		it("should not create a new recommendation if it already exists", async () => {
			jest.spyOn(
				recommendationRepository,
				"findByName"
			).mockResolvedValueOnce(true as any)

			const recommendationData = createRecommendationData()
			const promise = recommendationService.insert(recommendationData)
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
})

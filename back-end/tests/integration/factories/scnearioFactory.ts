import { createNewRecommendation } from "./recommendationsFactory"
import prisma from "../../../src/database"

const createScnearioAlreadyExistsRecommendation = async (
	length = 1,
	score = 0
) => {
	const recomendations = Array.from({ length }, () =>
		createNewRecommendation(score)
	)
	const result = Promise.all(
		recomendations.map(
			async rec => await prisma.recommendation.create({ data: rec })
		)
	)
	return result
}

const deleteAllData = async () => await prisma.recommendation.deleteMany()

export { createScnearioAlreadyExistsRecommendation, deleteAllData }

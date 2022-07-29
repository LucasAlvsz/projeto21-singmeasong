import { createNewRecomendation } from "./recomendationsFactory"
import prisma from "../../../src/database"

const createScnearioAlreadyExistsRecommendation = async (score = 0) => {
	const { name, youtubeLink } = createNewRecomendation()
	const createdRecommendation = await prisma.recommendation.create({
		data: {
			name,
			youtubeLink,
			score,
		},
	})
	return createdRecommendation
}

const deleteAllData = async () => await prisma.recommendation.deleteMany()

export { createScnearioAlreadyExistsRecommendation, deleteAllData }

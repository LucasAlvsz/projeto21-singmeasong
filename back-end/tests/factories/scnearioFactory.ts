import { createNewRecomendation } from "./recomendationsFactory"
import prisma from "../../src/database"

const createScnearioAlreadyExistsRecomendation = async () => {
	const { name, youtubeLink } = createNewRecomendation()
	await prisma.recommendation.create({
		data: {
			name,
			youtubeLink,
		},
	})
	return {
		name,
		youtubeLink,
	}
}

const deleteAllData = async () => await prisma.recommendation.deleteMany()

export { createScnearioAlreadyExistsRecomendation, deleteAllData }

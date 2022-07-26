import { faker } from "@faker-js/faker"
import { CreateRecommendationData } from "../../src/services/recommendationsService.js"

const createNewRecomendation = (): CreateRecommendationData => {
	return {
		name: faker.music.songName(),
		youtubeLink: faker.internet.url(),
	}
}

export { createNewRecomendation }

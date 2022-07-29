import { faker } from "@faker-js/faker"
import { CreateRecommendationData } from "../../src/services/recommendationsService.js"

const createNewRecomendation = (): CreateRecommendationData => {
	return {
		name: faker.music.songName(),
		youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
	}
}

export { createNewRecomendation }

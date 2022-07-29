import { faker } from "@faker-js/faker"

const createRecommendationData = () => {
	return {
		name: faker.random.words(),
		youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
	}
}

const createId = () => {
	return parseInt(faker.random.numeric())
}

export { createRecommendationData, createId }

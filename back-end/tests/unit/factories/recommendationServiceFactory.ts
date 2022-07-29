import { faker } from "@faker-js/faker"

const createRecommendationBody = () => {
	return {
		name: faker.random.words(),
		youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
	}
}

const createId = () => {
	return parseInt(faker.random.numeric())
}

const createScore = () => {
	return parseInt(faker.random.numeric())
}

const createRecommendationData = () => {
	const { name, youtubeLink } = createRecommendationBody()
	return {
		id: createId(),
		name,
		youtubeLink,
		score: createScore(),
	}
}

export {
	createRecommendationBody,
	createId,
	createScore,
	createRecommendationData,
}

import { faker } from "@faker-js/faker"

const createNewRecommendation = (score = 0) => {
	return {
		name: faker.music.songName(),
		youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
		...(score && { score }),
	}
}

export { createNewRecommendation }

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
	preset: "ts-jest",
	testEnvironment: "node",
	extensionsToTreatAsEsm: [".ts"],
	setupFiles: ["./tests/config/jest.setup.ts"],
	globals: {
		"ts-jest": {
			useESM: true,
		},
	},
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
}

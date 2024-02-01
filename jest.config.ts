import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
	testEnvironment: "jsdom",
	extensionsToTreatAsEsm: [".ts"],
	setupFiles: ["./src/jest.ts"],
	restoreMocks: true,
	clearMocks: true,
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				useESM: true,
			},
		],
	},
};

export default jestConfig;

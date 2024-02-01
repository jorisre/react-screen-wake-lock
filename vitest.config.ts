/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		setupFiles: ["@testing-library/jest-dom/vitest", "./src/vitest.ts"],
		include: ["./src/**/*.vitest.ts"],
		clearMocks: true,
		restoreMocks: true,
	},
});

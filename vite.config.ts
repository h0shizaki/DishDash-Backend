import { defineConfig } from 'vitest/config'
export default defineConfig({
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}'],
        exclude: ['src/model', 'src/service/interface'],
        coverage: {
            reporter: ['text', 'lcov'],
        },
    },
})

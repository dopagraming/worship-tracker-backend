export default {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'json', 'node'],
    testMatch: ['**/__tests__/**/*.test.js']
};
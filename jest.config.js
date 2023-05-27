module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['./'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.spec.ts$',
    transform: { '^.+\\.(t|j)sx?$': 'ts-jest' },
  };
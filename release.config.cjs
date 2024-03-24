/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  repositoryUrl: 'https://github.com/awaludinar/nestweb3.git',
  branches: ['action-test'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/git',
  ],
};

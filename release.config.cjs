/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  repositoryUrl: 'https://github.com/AwaludinAR/nestweb3.git',
  branches: [
    { name: 'main' },
    { name: 'action-test', channel: 'beta', prerelease: true },
    { name: 'next', channel: 'next', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: './CHANGELOG.md',
        changelogTitle: '# Changelog',
      },
    ],
    '@semantic-release/github',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
  ],
};

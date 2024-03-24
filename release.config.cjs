/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  repositoryUrl: 'https://github.com/AwaludinAR/nestweb3.git',
  branches: [
    { nam: 'action-test' },
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
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json'],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          'dist/**/*.{js,d.ts}',
          'CHANGELOG.md',
          'LICENSE',
          'README.md',
          'package.json',
          'package-lock.json',
        ],
        draftRelease: true,
      },
    ],
    '@semantic-release/npm',
  ],
};

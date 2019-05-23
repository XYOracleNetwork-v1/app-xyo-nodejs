
[logo]: https://cdn.xy.company/img/brand/XY_Logo_GitHub.png

![logo]

# app-xyo-nodejs

![npm](https://img.shields.io/npm/v/@xyo-network/app-xyo-nodejs.svg)
[![Build Status](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs.svg?branch=develop)](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs)
[![Known Vulnerabilities](https://snyk.io/test/github/XYOracleNetwork/app-xyo-nodejs/badge.svg)](https://snyk.io/test/github/XYOracleNetwork/app-xyo-nodejs)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=XYOracleNetwork_sdk-ble-android&metric=alert_status)](https://sonarcloud.io/dashboard?id=XYOracleNetwork_sdk-ble-android)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1f31c7fa87694b8eab91a2d71f74b697)](https://www.codacy.com/app/arietrouw/app-xyo-nodejs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=XYOracleNetwork/app-xyo-nodejs&amp;utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/f3dd4f4d35e1bd9eeabc/maintainability)](https://codeclimate.com/github/XYOracleNetwork/app-xyo-nodejs/maintainability)
[![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/app-xyo-nodejs?branch=master)](https://bettercodehub.com/)

The XYO application for running components on the XYO network

### Description
An archivist in the XYO network serves as the data-layer component between the bridge and the diviner. It accepts and aggregates data from bridges and makes that data available to Diviners via a GraphQL API. In essence it is the scribe node of the XYO network. This app will allow you to start up an archivist using MySQL, or if you have one configured, DynamoDB.

## Install

Using yarn 

```sh
  yarn add @xyo-network/app
```

Using npm

```sh
  npm install @xyo-network/app --save
```

## Usage

## Contributing

## Git Branch Standards

**Make sure that the branch you are on is current and checked out from the most updated remote state**

A key while working in a project is to ensure that you have the **latest code from the other branches**. ***especially those that you have checked out from.*** 

Remember to frequently: 

`git fetch --all`
`git pull <remote name - ususally origin> <branch name>`

We would recommend that you do this before pushing your committed code. 

**NOTE** Related: make sure that you are in communication with your project team, and that you check GitHub for updates to the codebase, especially the branch that you are checked out from. 

### Naming Your Branches

When you are checkout out new branches and naming them, you should follow a solid **git flow** method as outlined below: 
- For **feature branches** `feature/<feature you are working on>`
- For **bug fix branches - hot** `hotfix/<hotfix you are working on>`
- For **bug fix branches** `fix/<fix you are working on>` **NOTE** Only if this bug-fix will not interfere with dev worklflow
- For **release branch** `release/<version number>` **NOTE** Only if your project is working off of a release before merge into master

### Git Flow

**NOTE: Only the Develop and Release Branch can be merged into Master**

In order to ensure that production-ready software is truly ready, we need to maintain a strong git flow. This means that we should only merge our develop or release branch into master - essentially we want to lock the `master`, `release` and `develop` branches. The `develop` branch should be the home for all tested and production ready code that is ready for a final review with included checks before being brought into master, we can also use `release` for production staging. All checks would include CI/CD and code quality. 

For feature branches, you should `git checkout -b feature/<what feature name you are working on>`
**NOTE** Feature branches should always and **only** be checked out from the latest develop branch. 

Bug fixes, documentation updates, and minor styling should be done through a `release` branch which would be checked out from the latest `develop` branch after all feature branches have been merged into the `develop` branch.

The `develop` branch should also be where we conduct full app testing, as opposed to feature specific. To test features, you should make sure that all feature specifc tests pass in the `feature` branch that you are working on.

If you feel you may need to do a `hot-fix` directly to master, please communicate when to do this. **Do Not Take Hot Fixes Lightly**

### Tools

- [yarn package manager](https://yarnpkg.com/en/)
- [eslint](https://eslint.org/)
- [tslint](https://palantir.github.io/tslint/)
- [typescript](https://www.typescriptlang.org/)
- Use `@storybook` dependencies 
- Use `@type` dependencies

### Maintainers
- Carter Harrison
- Arie Trouw

Made with  ❤️  by [XY - The Persistent Company](https://xy.company)



[logo]: https://cdn.xy.company/img/brand/XY_Logo_GitHub.png

![logo]

# Archivist App Nodejs

[![NPM](https://nodei.co/npm/@xyo-network/app.png)](https://nodei.co/npm/@xyo-network/app/) 

[![Build Status](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs.svg?branch=develop)](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs) [![DepShield Badge](https://depshield.sonatype.org/badges/XYOracleNetwork/app-xyo-nodejs/depshield.svg)](https://depshield.github.io)

[![David Badge](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs/status.svg)](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs) [![David Badge](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs/dev-status.svg)](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs)

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=XYOracleNetwork_sdk-ble-android&metric=alert_status)](https://sonarcloud.io/dashboard?id=XYOracleNetwork_sdk-ble-android)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1f31c7fa87694b8eab91a2d71f74b697)](https://www.codacy.com/app/arietrouw/app-xyo-nodejs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=XYOracleNetwork/app-xyo-nodejs&amp;utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/f3dd4f4d35e1bd9eeabc/maintainability)](https://codeclimate.com/github/XYOracleNetwork/app-xyo-nodejs/maintainability) [![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/app-xyo-nodejs?branch=develop)](https://bettercodehub.com/results/XYOracleNetwork/app-xyo-nodejs)

Table of Contents

- [Sections](#sections)
- [Title](#Archivist-App-Nodejs)
- [Short Description](#short-description)
- [Long Description](#long-description)
- [Install](#install)
- [Usage](#usage)
- [Configure and Start an Archivist](#configure-and-start-an-archivist)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## Sections

### Short Description - The XYO application for running components on the XYO network

### Long Description - An archivist in the XYO network serves as the data-layer component between the bridge and the diviner. It accepts and aggregates data from bridges and makes that data available to Diviners via a GraphQL API. In essence it is the scribe node of the XYO network. This app will allow you to start up an archivist using MySQL, or if you have one configured, DynamoDB.

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

### Configure and Start an Archivist

```sh
yarn start
```

**NOTE** Keep this terminal window open and leave it alone after starting the archivist

For your first attempt, follow these steps **exactly** as written (if for some reason you are running any instances on ports (except the database port 3306) you can change the last digit by one - within the recommended ranges as seen below) although in your initial setup you should be okay using the default values given:

```sh
No config found, would you like to create one now? (Y/n) · true
``` 

```sh
What would you like to name your XYO Node? · <choose a name for your archivist>
```

```sh
Where would you like to store your data? · /Users/<yourUserDirectory>/<yourProjectDirectory>/sdk-core-nodejs/packages/app/node-data
```

```sh
What is your public ip address? · 0.0.0.0
```

```sh
What port would you like to use for your peer to peer protocol? · 11500
``` 
*Note* Make sure that this port is different than the diviner port, or any other port that might be in use. 

```sh 
Do you want to add bootstrap nodes? (Y/n) · false
```

```sh
Do you want to add any more individual bootstrap nodes? (y/N) · false
```

Ensure that your archivist can do bound witness
```sh
Do you want your node to act as a server for doing bound-witnesses? (Y/n) · true
```

Select your port for peer to peer protocol - bound witness
```sh 
What port would you like to use for your peer to peer protocol? · 11000
``` 

This is your bound witness port, it should be different from the diviner port

Ensure that the component features for support are *archivist*
```sh
Which component features do you want your Xyo Node to support? · archivist
``` 

If you select diviner, you won't get the correct options to set up an archivist

Set up the database with the values from your bootstrapping earlier
```sh
Enter the `host` value for your MySQL database · 127.0.0.1
Enter the `user` value for your MySQL database · admin
Enter the `password` value for your MySQL database · password
Enter the `database` value for your MySQL database · Xyo
```
**This is the one port value that you should not have to change!**
```sh
Enter the `port` value for your MySQL database · 3306
```

Set up your archivist with a GraphQL Server
```sh
Do you want your node to have a GraphQL server (Y/n) · true
```
```sh
What port should your GraphQL server run on? · 11001
```

Press enter to set up all of the GraphQL endpoints
```sh
Which GraphQL api endpoints would you like to support? (use space-bar to toggle selection. Press enter once finished) · about, blockByHash, blockList, intersections, blocksByPublicKey, entities
```

Start the node
```sh
Do you want to start the node after configuration is complete? (Y/n) · true
```

This will run through a few lifecycle methods and then start up the `SqlService`

This example is to run your archivist locally using a MySql instance

## Using DynamoDB

## API

# Contributing

## Developer Guide

### Git Branch Standards

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

Made with  ❤️  by [XY - The Persistent Company] (https://xy.company)


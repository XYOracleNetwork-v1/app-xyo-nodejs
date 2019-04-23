
[logo]: https://cdn.xy.company/img/brand/XY_Logo_GitHub.png

![logo]

[![Build Status](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs.svg?branch=develop)](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs) [![DepShield Badge](https://depshield.sonatype.org/badges/XYOracleNetwork/app-xyo-nodejs/depshield.svg)](https://depshield.github.io)

[![David Badge](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs/status.svg)](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs) [![David Badge](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs/dev-status.svg)](https://david-dm.org/xyoraclenetwork/app-xyo-nodejs)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1f31c7fa87694b8eab91a2d71f74b697)](https://www.codacy.com/app/arietrouw/app-xyo-nodejs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=XYOracleNetwork/app-xyo-nodejs&amp;utm_campaign=Badge_Grade) [![Maintainability](https://api.codeclimate.com/v1/badges/f3dd4f4d35e1bd9eeabc/maintainability)](https://codeclimate.com/github/XYOracleNetwork/app-xyo-nodejs/maintainability) [![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/app-xyo-nodejs?branch=develop)](https://bettercodehub.com/results/XYOracleNetwork/app-xyo-nodejs)

# App

The XYO application for running components on the XYO network

## Install

Using yarn 

```sh
  yarn add @xyo-network/app
```

Using npm

```sh
  npm install @xyo-network/app --save
```

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
What would you like to name your XYO Node? · <your name>
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
Do you want to add bootstrap nodes? (Y/n) · true
```

These addresses were found on the `peers.xyo.network` DNS record.You can select and deselect each address by pressing spacebar · Hit enter and do not select items

This will default to false, press `y` or `t`
```sh
Do you want to add any more individual bootstrap nodes? (y/N) · true
```

Go ahead and enter the example address provided
```sh
What is the address value of the bootstrap node? Should look something like /ip4/127.0.0.1/tcp/11500 · /ip4/127.0.0.1/tcp/11501
``` 
This port number should match the one that you entered for your peer to peer protocol answer **(for convention a good range is 11501 - 11510) one of the nodes needs to run 11500**

This will default to false, now we hit enter
```sh
Do you want to add any more individual bootstrap nodes? (y/N) · false
```
Ensure that your archivist can do bound witness
```sh
Do you want your node to act as a server for doing bound-witnesses? (Y/n) · true
```

Select your port for peer to peer protocol 
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

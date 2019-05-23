[logo]: https://cdn.xy.company/img/brand/XY_Logo_GitHub.png
[![logo]](https://xy.company)
# app-xyo-nodejs

![npm](https://img.shields.io/npm/v/@xyo-network/app-xyo-nodejs.svg)
[![Build Status](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs.svg?branch=develop)](https://travis-ci.com/XYOracleNetwork/app-xyo-nodejs)
[![Known Vulnerabilities](https://snyk.io/test/github/XYOracleNetwork/app-xyo-nodejs/badge.svg)](https://snyk.io/test/github/XYOracleNetwork/app-xyo-nodejs)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=XYOracleNetwork_sdk-ble-android&metric=alert_status)](https://sonarcloud.io/dashboard?id=XYOracleNetwork_sdk-ble-android)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1f31c7fa87694b8eab91a2d71f74b697)](https://www.codacy.com/app/arietrouw/app-xyo-nodejs?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=XYOracleNetwork/app-xyo-nodejs&amp;utm_campaign=Badge_Grade)
[![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/app-xyo-nodejs?branch=master)](https://bettercodehub.com/)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability)](https://codeclimate.com/github/XYOracleNetwork/app-xyo-nodejs/maintainability)

## Table of Contents

-   [Title](#app-xyo-nodejs)
-   [Description](#description)
-   [Logging](#logging)
-   [Maintainers](#maintainers)
-   [License](#license)
-   [Credits](#credits)

## Description

A core util/logging library inspired by XYO.

## Logging

You can access the logger from `XyoBase` or from an instance of `IXyoLog`. Logging levels are in the following order:

-   Error
-   Warning
-   Info (default)
-   Verbose
-   Debug
-   Silly

You can change the logging level for the console and for the log file by changing the environment vars: `XYO_LOG` (for logs), and `XYO_CONSOLE` (for console). The path and name of the log can be changed with the environment vars: `XYO_LOG_PATH` and `XYO_LOG_NAME`.

## Maintainers

-   Carter Harrison
-   Arie Trouw

## License

See the [LICENSE.md](LICENSE) file for license details

## Credits

Made with 🔥and ❄️ by [XY - The Persistent Company](https://www.xy.company)

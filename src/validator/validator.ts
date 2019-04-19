/*
 * File: validator.ts
 * Project: @xyo-network/app
 * File Created: Tuesday, 16th April 2019 9:19:05 am
 * Author: XYO Development Team (support@xyo.network)
 * -----
 * Last Modified: Tuesday, 16th April 2019 9:56:06 am
 * Modified By: XYO Development Team (support@xyo.network>)
 * -----
 * Copyright 2017 - 2019 XY - The Persistent Company
 */

import joi from 'joi'
import path from 'path'
import { fileExists } from '@xyo-network/utils'
import { IAppConfig } from '../@types'

export function promptValidator<T>(validator: (val: T) => Promise<IValidationResult>) {
  return async (v: T) => {
    const { validates, message } = await validator(v)
    if (validates) return true
    return message!
  }
}

function validateAgainstSchema<T>(val: T, schema: joi.Schema) {
  const result = joi.validate<T>(val, schema)
  if (result.error === null) {
    return {
      validates: true,
    }
  }

  return {
    validates: false,
    message: result.error.message,
  }
}

export async function validateNodeName(
  nodeName: string,
): Promise<IValidationResult> {
  const schema = joi.string()
    .regex(/[\w\_\-]+/)
    .min(1)
    .max(20)
    .required()
  return validateAgainstSchema<string>(nodeName, schema)
}

export async function validateIpAddress(
  ip: string,
): Promise<IValidationResult> {
  const schema = joi.string()
    .regex(
      /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    )
    .required()
  return validateAgainstSchema<string>(ip, schema)
}

export async function validateDataPath(
  dataPath: string,
): Promise<IValidationResult> {
  try {
    const parts = path.parse(dataPath)
    const parentFolderExists = await fileExists(parts.dir)
    if (parentFolderExists) {
      return {
        validates: true,
      }
    }

    return {
      validates: false,
      message: 'The parent folder does not exist',
    }
  } catch (err) {
    return {
      validates: false,
      message: (err as Error).message,
    }
  }
}

export async function validatePort(val: string) {
  try {
    const v = parseInt(val, 10)
    const schema = joi.number()
      .integer()
      .min(1)
      .max(65535)
      .required()
    return validateAgainstSchema<number>(v, schema)
  } catch (err) {
    return {
      validates: false,
      message: (err as Error).message,
    }
  }
}

export async function validateURL(url: string) {
  try {
    const schema = joi.string()
      .required()
      .uri()
    return validateAgainstSchema<string>(url, schema)
  } catch (err) {
    return {
      validates: false,
      message: (err as Error).message,
    }
  }
}

export async function validatePassword(
  password: string,
): Promise<IValidationResult> {
  try {
    if (password.length < 7) {
      return {
        validates: false,
        message: 'Must be at least 7 characters',
      }
    }

    const schema = joi.string()
      .regex(/[\w\_\-\s]+/)
      .min(7)
      .max(20)
      .required()
    return validateAgainstSchema<string>(password, schema)
  } catch (err) {
    return {
      validates: false,
      message: (err as Error).message,
    }
  }
}

export async function validateHexString(hexString: string) {
  try {
    if (!hexString.startsWith('0x')) {
      return {
        validates: false,
        message: 'Must start with 0x',
      }
    }

    const schema = joi.string()
      .min(1)
      .required()
      .hex()
    return validateAgainstSchema<string>(hexString.substring(2), schema)
  } catch (err) {
    return {
      validates: false,
      message: (err as Error).message,
    }
  }
}

export async function validateMultiAddress(addr: string) {
  const parts = addr.split('/')
  if (
    parts.length !== 5 ||
    parts[0] !== '' ||
    parts[1] !== 'ip4' ||
    parts[3] !== 'tcp'
  ) {
    return {
      validates: false,
      message: 'Malformed address',
    }
  }

  const ipVal = await validateIpAddress(parts[2])
  if (!ipVal.validates) return ipVal
  return validatePort(parts[4])
}

export async function validateConfigFile(
  config: IAppConfig,
): Promise<IValidationResult> {
  return {
    validates: true,
  }
}

export interface IValidationResult {
  validates: boolean
  message?: string
}

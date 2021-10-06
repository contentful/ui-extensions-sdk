import { Link } from './utils'

export interface BaseValidationError {
  name: string
  message?: string
  details?: string
  value?: any
  customMessage?: string
  path: string[]
}

export interface SizeValidationError extends BaseValidationError {
  name: 'size'
  max: number
  min: number
}

export interface RangeValidationError extends BaseValidationError {
  name: 'range'
  min?: number
  max?: number
}

export interface InValidationError extends BaseValidationError {
  name: 'in'
  expected: string[]
}

export interface RequiredValidationError extends BaseValidationError {
  name: 'required'
}

export interface UniqueValidationError extends BaseValidationError {
  name: 'unique'
  conflicting: Link<'Entry', 'Link'>[]
}

export interface ProhibitRegexpValidationError extends BaseValidationError {
  name: 'prohibitRegexp'
}

export interface RegexpValidationError extends BaseValidationError {
  name: 'regexp'
}

export interface LinkMimetypeGroupValidationError extends BaseValidationError {
  name: 'linkMimetypeGroup'
  mimetypeGroupName: string[]
}

export interface LinkContentTypeValidationError extends BaseValidationError {
  name: 'linkContentType'
  contentTypeId: string[]
}

export interface DateRangeValidationError extends BaseValidationError {
  name: 'dateRange'
  min: number
  max: number
}

export interface NotResolvableValidationError extends BaseValidationError {
  name: 'notResolvable'
  link: {
    linkType: string
  }
}

export interface UnknownValidationError extends BaseValidationError {
  name: 'unknown'
}

export interface TypeValidationError extends BaseValidationError {
  name: 'type'
  type: string
}

export type ValidationError =
  | SizeValidationError
  | RangeValidationError
  | InValidationError
  | RequiredValidationError
  | UniqueValidationError
  | RegexpValidationError
  | ProhibitRegexpValidationError
  | LinkMimetypeGroupValidationError
  | LinkContentTypeValidationError
  | DateRangeValidationError
  | NotResolvableValidationError
  | UnknownValidationError
  | TypeValidationError
  | BaseValidationError

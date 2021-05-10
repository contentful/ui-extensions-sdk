import { Items } from './utils'
import { FieldAPI } from './field-locale.types'

export interface FieldInfo {
  id: string
  locale: string
  type: string
  required: boolean
  validations: Object[]
  items?: Items
  value: any
}

export interface EntryFieldInfo {
  id: string
  locales: string[]
  type: string
  required: boolean
  validations: Object[]
  items?: Items
  values: { [locale: string]: any }
}

export interface EntryFieldAPI {
  /** The ID of a field is defined in an entry's content type. */
  id: string
  /** The list of locales for the field. */
  locales: string[]
  /** Holds the type of the field. */
  type: string
  /** Indicates if a value for this field is required */
  required: boolean
  /** A list of validations for this field that are defined in the content type. */
  validations: Object[]
  /** Defines the shape of array items */
  items?: Items

  /** Gets the current value of the field and locale. */
  getValue: (locale?: string) => any
  /** Sets the value for the field and locale.  */
  setValue: (value: any, locale?: string) => Promise<any>
  /** Removes the value for the field and locale. */
  removeValue: (locale?: string) => Promise<void>
  /** Calls the callback every time the value of the field is changed by an external event or when setValue() is called.
   *  the returned function can be called to remove the handler function */
  onValueChanged: {
    (callback: (value: any) => void): () => void
    (locale: string, callback: (value: any) => void): () => void
  }
  /** Calls the callback when the disabled status of the field changes.
   *  the returned function can be called to remove the handler function */
  onIsDisabledChanged: {
    (callback: (isDisabled: boolean) => void): () => void
    (locale: string, callback: (isDisabled: boolean) => void): () => void
    (...args: any[]): () => void
  }

  /** Get an instance of FieldAPI for this field, specific to the locale that is
   * passed as an argument */
  getForLocale: (locale: string) => FieldAPI
}

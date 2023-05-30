import { ContentTypeFieldValidation } from './entities'
import type { SerializedJSONValue, FieldType, Items } from './utils'
import { ValidationError } from './validation-error'

export interface FieldAPI {
  /** The ID of a field is defined in an entry's content type. */
  id: string
  /** The current locale of a field the app is attached to. */
  locale: string
  /** Holds the type of the field the app is attached to. */
  type: FieldType
  /** Indicates if a value for this field is required */
  required: boolean
  /** A list of validations for this field that are defined in the content type. */
  validations: ContentTypeFieldValidation[]
  /** Defines the shape of array items */
  items?: Items
  /** Gets the current value of the field and locale. */
  getValue: () => any
  /** Sets the value for the field and locale.  */
  setValue: <Value = any>(value: Value) => Promise<SerializedJSONValue | undefined>
  /** Removes the value for the field and locale. */
  removeValue: () => Promise<void>
  /** Communicates to the web application if the field is in a valid state or not. */
  setInvalid: (value: boolean) => void

  /** Calls the callback every time the value of the field is changed by an external event or when setValue() is called.
   *  the returned function can be called to remove the handler function
   **/
  onValueChanged: (callback: (value: any) => void) => () => void

  /**
   * Returns whether the current field is disabled
   *
   * The disabled state can change. To always work with the latest state, use `onIsDisabledChanged`.
   */
  getIsDisabled(): boolean

  /**
   * Subscribes to changes to this field's disabled state
   *
   * @param callback Function that is called every time this field's disabled state changes. Called immidiately with the current state.
   * @returns Function to unsubscribe. `callback` won't be called anymore.
   */
  onIsDisabledChanged: (callback: (isDisabled: boolean) => void) => () => void

  /**
   * Returns the field's validation errors
   *
   * The schema errors can change. To always work with the latest errors, use `onSchemaErrorsChanged`.
   */
  getSchemaErrors(): ValidationError[]

  /**
   * Subscribes to schema errors
   *
   * @param callback Function that is called every time the schema errors change. Called immediately with the current errors.
   * @returns Function to unsubscribe. `callback` won't be called anymore.
   */
  onSchemaErrorsChanged: (callback: (errors: ValidationError[]) => void) => () => void
}

import { ContentTypeFieldValidation } from './entities'
import type { Items, SerializedJSONValue } from './utils'
import { ValidationError } from './validation-error'

export interface FieldAPI {
  /** The ID of a field is defined in an entry's content type. */
  id: string
  /** The current locale of a field the app is attached to. */
  locale: string
  /** Holds the type of the field the app is attached to. */
  type: string
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
  /** Calls the callback when the disabled status of the field changes.
   *  the returned function can be called to remove the handler function
   **/
  onIsDisabledChanged: (callback: (isDisabled: boolean) => void) => () => void
  /** Calls the callback immediately with the current validation errors and whenever the field is re-validated.
   *  the returned function can be called to remove the handler function
   **/
  onSchemaErrorsChanged: (callback: (errors: ValidationError[]) => void) => () => void
}

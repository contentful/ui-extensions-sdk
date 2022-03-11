// TODO: specify entries type
export type EntryListEntriesType = any

export type EntryListExtraDataType = {
  values: { [entryId: string]: string }
}

export type OnEntryListUpdatedHandlerReturn = { data: EntryListExtraDataType } | false

export type OnEntryListUpdatedHandlerProps = {
  entries: EntryListEntriesType
}

export type OnEntryListUpdatedHandler = (
  props: OnEntryListUpdatedHandlerProps
) => OnEntryListUpdatedHandlerReturn | Promise<OnEntryListUpdatedHandlerReturn>

export interface EntryListAPI {
  /** Registers a handler to be called every time entries on EntryList changes */
  onEntryListUpdated: (handler: OnEntryListUpdatedHandler) => void
}

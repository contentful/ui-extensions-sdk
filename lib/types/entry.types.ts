import { Metadata, Task } from './entities'
import { EntryFieldAPI } from './field.types'
import { CollectionResponse, EntrySys, SearchQuery } from './utils'

type TaskState = 'active' | 'resolved'

export interface TaskInputData {
  assignedToId: string
  assignedToType?: 'User' | 'Team'
  body: string
  status: TaskState
  dueDate?: string
}

/** Allows accessing the Task API for the current entry. */
export interface TaskAPI {
  getTask(id: string): Promise<Task>

  getTasks(query?: SearchQuery): Promise<CollectionResponse<Task>>

  createTask(data: TaskInputData): Promise<Task>

  updateTask(task: Task): Promise<Task>

  deleteTask(task: Task): Promise<void>
}

export type ReleaseEntrySys = EntrySys & { release: { sys: { id: string } } }

export interface EntryAPI extends TaskAPI {
  /** Returns sys for an entry. */
  // eventually, EntrySys might already provide an optional `release` property, at which point
  // we can remove ReleaseEntrySys
  getSys: () => EntrySys | ReleaseEntrySys
  /** Publish the entry */
  publish: (options?: { skipUiValidation?: boolean }) => Promise<void>
  /** Unpublish the entry */
  unpublish: () => Promise<void>
  /** Saves the current changes of the entry */
  save: () => Promise<void>
  /** Calls the callback with sys every time that sys changes. */
  onSysChanged: (callback: (sys: EntrySys) => void) => () => void
  /** Allows to control the values of all other fields in the current entry. */
  fields: { [key: string]: EntryFieldAPI }
  /**
   * Optional metadata on an entry
   * @deprecated
   */
  metadata?: Metadata
  getMetadata: () => Metadata | undefined
  onMetadataChanged: (callback: (metadata?: Metadata) => void) => VoidFunction
}

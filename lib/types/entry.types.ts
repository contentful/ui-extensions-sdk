import { Metadata, Task } from './entities'
import { EntryFieldAPI } from './field.types'
import { CollectionResponse, ContentEntitySys } from './utils'

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

  getTasks(): Promise<CollectionResponse<Task>>

  createTask(data: TaskInputData): Promise<Task>

  updateTask(task: Task): Promise<Task>

  deleteTask(task: Task): Promise<void>
}

export interface EntryAPI extends TaskAPI {
  /** Returns sys for an entry. */
  getSys: () => ContentEntitySys
  /** Publish the entry */
  publish: () => void
  /** Unpublish the entry */
  unpublish: () => void
  /** Calls the callback with sys every time that sys changes. */
  onSysChanged: (callback: (sys: ContentEntitySys) => void) => () => void
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

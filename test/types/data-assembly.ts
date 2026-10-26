import type {
  DataAssemblyParameterConfig,
  DataAssemblyParameterDefinitionWithId,
} from 'contentful-management'
import type {
  DataAssemblyAPI,
  DataAssemblyParameterAPI,
  DataAssemblyParameterDefinition,
  DataAssemblySnapshot,
  DataAssemblySummary,
  ExperienceNodeAPI,
} from '../../lib/types'

type SameType<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false
type RequireTrue<T extends true> = T

// Every public declaration surface shares the canonical Management SDK contract.
export type CanonicalDeclaration = RequireTrue<
  SameType<DataAssemblyParameterDefinition, DataAssemblyParameterDefinitionWithId>
>
export type CanonicalSnapshot = RequireTrue<
  SameType<DataAssemblySnapshot['parameters'], DataAssemblyParameterConfig>
>
export type CanonicalSummary = RequireTrue<
  SameType<DataAssemblySummary['parameters'], DataAssemblyParameterConfig>
>
export type CanonicalRootDefinitions = RequireTrue<
  SameType<
    Awaited<ReturnType<DataAssemblyAPI['getParameterDefinitions']>>,
    DataAssemblyParameterConfig
  >
>
export type CanonicalNodeDefinitions = RequireTrue<
  SameType<
    Awaited<ReturnType<ExperienceNodeAPI['dataAssembly']['getParameterDefinitions']>>,
    DataAssemblyParameterConfig
  >
>
export type CanonicalIndividualDefinition = RequireTrue<
  SameType<
    Awaited<ReturnType<DataAssemblyParameterAPI['getParameterDefinition']>>,
    DataAssemblyParameterDefinitionWithId | null
  >
>

// Array-only declarations reject the old record shape and require both canonical fields.
export type RecordShapeRejected = RequireTrue<
  SameType<
    Record<string, DataAssemblyParameterDefinition> extends DataAssemblyParameterConfig
      ? true
      : false,
    false
  >
>
export type MissingIdRejected = RequireTrue<
  SameType<
    { type: 'String'; required: false } extends DataAssemblyParameterDefinition ? true : false,
    false
  >
>
export type MissingRequirednessRejected = RequireTrue<
  SameType<
    { type: 'String'; id: 'title' } extends DataAssemblyParameterDefinition ? true : false,
    false
  >
>

export type NestedMissingRequirednessRejected = RequireTrue<
  SameType<
    {
      id: 'query'
      type: 'Record'
      required: true
      fields: [{ id: 'limit'; type: 'Number'; fallbackValue: 0 }]
    } extends DataAssemblyParameterDefinition
      ? true
      : false,
    false
  >
>

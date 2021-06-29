/**
 * Removes data from an object which is subject to change
 * based on the environment
 */
export function removeVariableData(obj: { sys: any }) {
  const { createdAt, updatedAt, revision, ...rest } = obj.sys

  return {
    ...obj,
    sys: rest,
  }
}

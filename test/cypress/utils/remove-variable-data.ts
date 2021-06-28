export function removeVariableData(o: { sys: any }) {
  const { createdAt, updatedAt, revision, ...rest } = o.sys

  return {
    ...o,
    sys: rest,
  }
}

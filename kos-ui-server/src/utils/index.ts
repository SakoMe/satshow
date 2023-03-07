/**
 * @summary Convert a bigint to a string so it can be serialized
 * @param obj - the object to convert
 * @return the object with bigints converted to strings
 */
export function formatBigInts(obj: unknown) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    ),
  );
}

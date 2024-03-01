export function getValueByCaseInsensitiveKey(
  object: { [key: string]: string },
  key: string
): string | undefined {
  const asLowercase = key.toLowerCase();
  return Object.entries(object).find(
    (k) => k[0].toLowerCase() === asLowercase
  )?.[1];
}

export function getMandatoryValueByCaseInsensitiveKey(
  object: { [key: string]: string },
  key: string
): string {
  const value = getValueByCaseInsensitiveKey(object, key);
  if (value === undefined) {
    throw new Error(`Missing field '${key}'`);
  }
  return value;
}

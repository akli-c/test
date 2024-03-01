export function chunkArray<T>(
  array: Array<T>,
  chunkSize: number
): Array<Array<T>> {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function tryPush<T>(list: T[] | undefined, item: T | undefined): T[] {
  return item ? [...(list || []), item] : list || [];
}

export function checkFields(
  object: any,
  objectId: string,
  mandatoryFields: string[]
): string | undefined {
  const missingFields = mandatoryFields.filter((f) => !checkField(object, f));
  if (missingFields.length) {
    return `Missing fields '${missingFields.join(",")}' in '${objectId}'`;
  }

  return undefined;
}

function checkField(object: any, field: string): boolean {
  let objects = [object];
  for (let f of field.split(".")) {
    if (
      objects.some(
        (o) => o[f] === undefined || o[f] === "" || o[f].length === 0
      )
    )
      return false;
    objects = objects.flatMap((o) => (Array.isArray(o[f]) ? o[f] : [o[f]]));
  }
  return true;
}

export function dateToyyyyMMdd(
  date: Date,
  separator: string | undefined = undefined
): string {
  const DS: string =
    date.getFullYear() +
    (separator || "") +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    (separator || "") +
    ("0" + date.getDate()).slice(-2);
  return DS;
}

export function parseNum(num: string | number): number | undefined {
  if (typeof num === "number") return num;
  const parsed = +num?.replace(",", ".");
  return isNaN(parsed) ? undefined : parsed;
}

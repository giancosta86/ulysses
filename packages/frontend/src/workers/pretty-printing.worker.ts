function prettyPrint(value: any): string {
  return JSON.stringify(value, undefined, 4)
}

export function prettyPrintItems<T>(items: readonly T[]): Promise<string> {
  return Promise.resolve(items.map((item) => prettyPrint(item)).join(",\n\n"))
}

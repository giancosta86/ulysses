export interface LineError {
  line: string;
  message: string;
}

export function isLineError(instance: any): instance is LineError {
  return "line" in instance && "message" in instance;
}

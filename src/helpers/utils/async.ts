import { main } from "index";

export function catchError(promise: Promise<unknown>): void {
  promise.catch((error) => {
    console.error(error);
  });
}

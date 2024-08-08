import { ILoadAndRunnable } from "./interfaces";

export async function loadAndRun(obj: ILoadAndRunnable | ILoadAndRunnable[]): Promise<void> {
  const args = Array.isArray(obj) ? obj : [obj];
  await Promise.all(args.map(a=>a.loadAndRun()));
}

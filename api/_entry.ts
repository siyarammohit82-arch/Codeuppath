import type { IncomingMessage, ServerResponse } from "http";
import app, { setupApp } from "../server/app";

const setupPromise = setupApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await setupPromise;
  return app(req as any, res as any);
}

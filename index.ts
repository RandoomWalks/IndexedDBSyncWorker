import "reflect-metadata";
import { Container } from "typedi";
import { SyncManager } from "./SyncManager";

async function startSync() {
  const syncManager = Container.get(SyncManager);
  await syncManager.performSync();
}

startSync();


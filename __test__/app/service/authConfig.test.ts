import { expect, test } from "vitest";
import { WebStorageStateStore } from "oidc-client-ts";
import { cognitoAuthConfig } from "../../../app/service/authConfig";

test("le userStore est persisté dans le localStorage du navigateur", () => {
  const userStore = cognitoAuthConfig.userStore as WebStorageStateStore;
  expect(userStore).toBeInstanceOf(WebStorageStateStore);
  expect(userStore["_store"]).toBe(window.localStorage);
});

test("le renouvellement silencieux et la surveillance de session sont toujours actifs", () => {
  expect(cognitoAuthConfig.automaticSilentRenew).toBe(true);
  expect(cognitoAuthConfig.monitorSession).toBe(true);
});

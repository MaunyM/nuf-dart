import { afterEach, expect, test, vi } from "vitest";
import {
  resumeSessionOnReconnect,
  restoreGame,
  signOut,
  subscribeToSessionExpiry,
} from "../../../app/service/gameService";
import { AuthContextProps } from "react-oidc-context";
import { Game, Game_State } from "@/app/Type/Game";
import { cognitoAuthConfig, cognitoDomain } from "../../../app/service/authConfig";

function authWithExpiredUser(expired: boolean): AuthContextProps {
  return {
    user: { expired },
    signinSilent: vi.fn().mockResolvedValue(undefined),
  } as unknown as AuthContextProps;
}

test("reconnexion réseau renouvelle la session si elle a expiré", () => {
  const auth = authWithExpiredUser(true);
  const unsubscribe = resumeSessionOnReconnect(auth);

  window.dispatchEvent(new Event("online"));

  expect(auth.signinSilent).toHaveBeenCalled();
  unsubscribe();
});

test("reconnexion réseau ne renouvelle pas une session toujours valide", () => {
  const auth = authWithExpiredUser(false);
  const unsubscribe = resumeSessionOnReconnect(auth);

  window.dispatchEvent(new Event("online"));

  expect(auth.signinSilent).not.toHaveBeenCalled();
  unsubscribe();
});

test("la déconnexion révoque le refresh token, supprime la session locale puis redirige vers le logout Cognito", async () => {
  const callOrder: string[] = [];
  const auth = {
    revokeTokens: vi.fn().mockImplementation(async () => {
      callOrder.push("revokeTokens");
    }),
    removeUser: vi.fn().mockImplementation(async () => {
      callOrder.push("removeUser");
    }),
  } as unknown as AuthContextProps;

  const location = { href: "" };
  vi.stubGlobal("location", location);

  await signOut(auth);

  expect(callOrder).toEqual(["revokeTokens", "removeUser"]);
  expect(auth.revokeTokens).toHaveBeenCalledWith(["refresh_token"]);
  expect(location.href).toBe(
    `${cognitoDomain}/logout?client_id=${cognitoAuthConfig.client_id}&logout_uri=${encodeURIComponent(cognitoAuthConfig.redirect_uri)}`
  );
});

test("l'expiration définitive de la session déclenche le callback onExpired", () => {
  const handlers: Record<string, () => void> = {};
  const auth = {
    events: {
      addSilentRenewError: vi.fn((cb: () => void) => { handlers.silentRenewError = cb; }),
      addUserSignedOut: vi.fn((cb: () => void) => { handlers.userSignedOut = cb; }),
      removeSilentRenewError: vi.fn(),
      removeUserSignedOut: vi.fn(),
    },
  } as unknown as AuthContextProps;

  const onExpired = vi.fn();
  const unsubscribe = subscribeToSessionExpiry(auth, onExpired);

  handlers.silentRenewError();
  expect(onExpired).toHaveBeenCalledTimes(1);

  unsubscribe();
  expect(auth.events.removeSilentRenewError).toHaveBeenCalledWith(onExpired);
  expect(auth.events.removeUserSignedOut).toHaveBeenCalledWith(onExpired);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("restoreGame retourne la partie persistée quand l'API répond 200", async () => {
  const game: Game = {
    throws: [],
    status: Game_State.THROWING,
    dart_count: 3,
    scores: [],
    players: [],
    round: 0,
  };
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(game),
  }));

  expect(await restoreGame()).toEqual(game);
});

test("restoreGame retourne undefined quand l'API répond 404", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));

  expect(await restoreGame()).toBeUndefined();
});

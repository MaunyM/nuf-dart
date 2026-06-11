import { InMemoryWebStorage, WebStorageStateStore } from "oidc-client-ts";
import { AuthProviderNoUserManagerProps } from "react-oidc-context";

// Cognito hosted UI domain (issues the /oauth2/authorize, /oauth2/token and /logout endpoints).
export const cognitoDomain = "https://login.larus.fr";

export const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-3.amazonaws.com/eu-west-3_hdaUJXlME",
  client_id: "1cusrvvn01cc7dq61lk8g7mr1a",
  redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI as string,
  response_type: "code",
  lang: "fr",
  scope: "aws.cognito.signin.user.admin email openid profile",
  userStore: new WebStorageStateStore({
    store: typeof window !== "undefined" ? window.localStorage : new InMemoryWebStorage(),
  }),
  automaticSilentRenew: true,
  monitorSession: true,
} as AuthProviderNoUserManagerProps;

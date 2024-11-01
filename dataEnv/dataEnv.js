export const phoneUser = "7777937484";

const nodeEnv = process.env.NODE_ENV;

export const hostURL =
  nodeEnv === "development"
    ? process.env.NEXT_PUBLIC_DEV_ENV
    : process.env.NEXT_PUBLIC_PRD_ENV;

export const LOCALSTORAGE_KEY =
  process.env.NEXT_PUBLIC_LOCALSTORAGE_KEY || "myToken";
export const COOKIE_KEY = process.env.NEXT_PUBLIC_COOKIE_KEY || "myCookie";
export const COOKIE_ADMIN = process.env.NEXT_PUBLIC_COOKIE_ADMIN || "admin";
export const ROLE_ADMIN = process.env.NEXT_PUBLIC_ROLE_ADMIN || "admin";
export const WS_KEY = process.env.NEXT_PUBLIC_WEBSOCKET_KEY || "wsKey";
export const SF_USERNAME = process.env.SF_USERNAME || "sfUsername";
export const SF_PASSWORD = process.env.SF_PASSWORD || "sfPassword";
export const SF_TOKEN = process.env.SF_SECURITY_TOKEN || "sfToken";
export const SF_CLIENT_ID = process.env.NEXT_PUBLIC_SF_CLIENT_ID || "sfClientId";
export const SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET || "sfClientSecret";
export const SF_CALLBACK_URL = process.env.NEXT_PUBLIC_SF_CALLBACK_URL || "sfCallbackUrl";
export const SF_ENDPOINT = process.env.NEXT_PUBLIC_SF_ENDPOINT || "sfEndpoint";

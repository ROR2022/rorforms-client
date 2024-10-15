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

import * as Sentry from "@sentry/react";
import { v4 as uuidv4 } from "uuid";
import getConfig from "constant/envCofnig";
const envConfig = getConfig();

// This is used to identify the user in Sentry.
const SENTRY_USER_ID_KEY = "sentry-user-id";

const SENTRY_ENABLE = process.env.NODE_ENV === "production";

Sentry.init({
  dsn: envConfig.SENTRY_DSN,
  release: process.env.REACT_APP_GIT_COMMIT_HASH,
  environment: process.env.REACT_APP_ENV_VERSION,
  enabled: SENTRY_ENABLE,
  integrations: [
    new Sentry.BrowserTracing({
      startTransactionOnLocationChange: false,
      startTransactionOnPageLoad: true,
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

let sentryUserId = localStorage.getItem(SENTRY_USER_ID_KEY);
if (!sentryUserId) {
  localStorage.setItem(SENTRY_USER_ID_KEY, (sentryUserId = uuidv4()));
}
Sentry.setUser({ id: sentryUserId });

window.logError = (message, ...optionalParams) => {
  console.error(message, ...optionalParams);
  if (SENTRY_ENABLE) {
    const errMsg = `${message} ${optionalParams.join(" ")}`;
    Sentry.captureMessage(errMsg, "error");
  }
};
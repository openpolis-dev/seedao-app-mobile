import * as Sentry from "@sentry/react";
import React, { PropsWithChildren, useState } from "react";
import styled from "styled-components";
import CopyBox from "./common/copy";

const FallbackWrapper = styled.div`
  display: flex;
  width: calc(100vw - 8px);
  height: 100vh;
`;

const BodyWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 1rem;
`;

const StretchedRow = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  > * {
    flex: 1;
  }
  button {
    width: 100%;
  }
`;

const Code = styled.code`
  font-weight: 485;
  font-size: 12px;
  line-height: 16px;
  word-wrap: break-word;
  width: 100%;
  overflow: scroll;
  max-height: calc(100vh - 450px);
`;

const Separator = styled.div`
  border-bottom: 1px solid #ddd;
`;

const CodeBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

const ShowMoreButton = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: space-between;
`;

const CodeTitle = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  word-break: break-word;
`;

const Content = styled.div`
  padding: 24px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 24px;
`;

const Button = styled.button`
  outline: none;
  border: none;
  height: 36px;
  border-radius: 8px;
  padding-inline: 10px;
  font-size: 14px;
  background-color: var(--primary-color);
  color: #fff;
`;

const Fallback = ({ error, eventId }) => {
  const [isExpanded, setExpanded] = useState(false);
  const showErrorId = eventId;

  const showMoreButton = (
    <ShowMoreButton onClick={() => setExpanded((s) => !s)}>{isExpanded ? "Show less" : "Show more"}</ShowMoreButton>
  );

  const errorDetails = error.stack || error.message;

  return (
    <FallbackWrapper>
      <BodyWrapper>
        <Content>
          {showErrorId ? (
            <>
              <div>
                <div>Something went wrong</div>
                <div>
                  Sorry, an error occured while processing your request. If you request support, be sure to provide your
                  error ID.
                </div>
              </div>
              <CodeBlockWrapper>
                <CodeTitle>
                  <div>Error ID: {eventId}</div>
                  <CopyBox text={eventId}></CopyBox>
                </CodeTitle>
                <Separator />
                {isExpanded && <Code>{errorDetails}</Code>}
                {showMoreButton}
              </CodeBlockWrapper>
            </>
          ) : (
            <>
              <div>
                <div>Something went wrong</div>
                <div>
                  Sorry, an error occured while processing your request. If you request support, be sure to copy the
                  details of this error.
                </div>
              </div>
              <CodeBlockWrapper>
                <CodeTitle>
                  <div>Error details</div>
                  <CopyBox text={errorDetails}></CopyBox>
                </CodeTitle>
                <Separator />
                <Code>{errorDetails?.split("\n").slice(0, isExpanded ? undefined : 4)}</Code>
                {showMoreButton}
              </CodeBlockWrapper>
            </>
          )}
        </Content>

        <StretchedRow>
          <span>
            <Button onClick={() => window.location.reload()}>Reload the app</Button>
          </span>
          <a href="https://seedao.canny.io/feedback " target="_blank" rel="noreferrer">
            <Button>Report</Button>
          </a>
        </StretchedRow>
      </BodyWrapper>
    </FallbackWrapper>
  );
};

async function updateServiceWorker() {
  const ready = await navigator.serviceWorker.ready;
  // the return type of update is incorrectly typed as Promise<void>. See
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
  return ready.update();
}

const updateServiceWorkerInBackground = async () => {
  try {
    const registration = await updateServiceWorker();

    // We want to refresh only if we detect a new service worker is waiting to be activated.
    // See details about it: https://web.dev/service-worker-lifecycle/
    if (registration?.waiting) {
      await registration.unregister();

      // Makes Workbox call skipWaiting().
      // For more info on skipWaiting see: https://web.dev/service-worker-lifecycle/#skip-the-waiting-phase
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  } catch (error) {
    window.logError("Failed to update service worker", error);
  }
};

export default function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, eventId }) => <Fallback error={error} eventId={eventId} />}
      beforeCapture={(scope) => {
        scope.setLevel("fatal");
      }}
      onError={() => {
        updateServiceWorkerInBackground();
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

"use client";

import { useEffect, useState } from "react";

type ConsentChoice = "accepted" | "rejected";
type ConsentVariant = "retro" | "3d" | "ugly";

const CONSENT_KEY = "simon-kane-analytics-consent";
const CLARITY_SCRIPT_ID = "microsoft-clarity-consented";

function queueClarityConsent(consented: boolean) {
  window.clarity?.("consent", consented);
}

function removeClarityCookies() {
  const cookieNames = ["_clck", "_clsk"];
  const hostParts = window.location.hostname.split(".");
  const domains = [
    window.location.hostname,
    hostParts.length > 1 ? `.${hostParts.slice(-2).join(".")}` : "",
  ].filter(Boolean);

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}; SameSite=Lax`;
    }
  }
}

function loadClarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  if (!projectId || document.getElementById(CLARITY_SCRIPT_ID)) return;

  window.clarity =
    window.clarity ||
    function clarityShim(...args: unknown[]) {
      window.clarity!.q = window.clarity!.q || [];
      window.clarity!.q.push(args);
    };

  queueClarityConsent(true);

  const script = document.createElement("script");
  script.id = CLARITY_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${projectId}`;
  document.head.appendChild(script);
}

export function CookieConsent({ variant }: { variant: ConsentVariant }) {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(CONSENT_KEY);
    const normalizedChoice =
      storedChoice === "accepted" || storedChoice === "rejected"
        ? storedChoice
        : null;

    window.queueMicrotask(() => {
      setChoice(normalizedChoice);
      setReady(true);
    });

    if (normalizedChoice === "accepted") {
      loadClarity();
    }

    if (normalizedChoice === "rejected") {
      queueClarityConsent(false);
      removeClarityCookies();
    }
  }, []);

  const saveChoice = (nextChoice: ConsentChoice) => {
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
    setChoice(nextChoice);

    if (nextChoice === "accepted") {
      loadClarity();
      return;
    }

    queueClarityConsent(false);
    removeClarityCookies();
  };

  const resetChoice = () => {
    window.localStorage.removeItem(CONSENT_KEY);
    setChoice(null);
    queueClarityConsent(false);
    removeClarityCookies();
  };

  if (!ready) return null;

  return (
    <>
      {!choice && (
        <aside
          className={`cookieConsent cookieConsent-${variant}`}
          aria-labelledby="cookie-consent-title"
        >
          <div className="cookieConsentTitleBar">
            <span id="cookie-consent-title">Analytics preferences</span>
          </div>
          <div className="cookieConsentText">
            <span className="cookieConsentWarningIcon" aria-hidden="true" />
            <strong>Optional analytics</strong>
            <p>
              I use Vercel Analytics and, only with your consent, Microsoft
              Clarity to improve this portfolio.
            </p>
            <a href="/privacy">Privacy policy</a>
          </div>
          <div className="cookieConsentActions">
            <button type="button" onClick={() => saveChoice("rejected")}>
              Reject
            </button>
            <button type="button" onClick={() => saveChoice("accepted")}>
              Accept
            </button>
          </div>
        </aside>
      )}

      {choice && (
        <button
          className={`cookieSettings cookieSettings-${variant}`}
          type="button"
          onClick={resetChoice}
        >
          Analytics {choice === "accepted" ? "on" : "off"}
        </button>
      )}
    </>
  );
}

declare global {
  interface Window {
    clarity?: {
      (...args: unknown[]): void;
      q?: unknown[][];
    };
  }
}

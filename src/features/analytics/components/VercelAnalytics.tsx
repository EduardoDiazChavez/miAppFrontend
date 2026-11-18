"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

function stripUrlParameters(event: BeforeSendEvent): BeforeSendEvent {
  const url = new URL(event.url, window.location.origin);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}

export function VercelAnalytics() {
  return <Analytics beforeSend={stripUrlParameters} />;
}

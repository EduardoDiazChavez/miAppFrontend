"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, apiRequest, notifySessionChanged } from "../lib/api-client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: { theme: "outline"; size: "large"; width: number; text: "continue_with" },
          ) => void;
        };
      };
    };
  }
}

type GoogleLoginButtonProps = {
  onSuccess: () => void;
  onError: (message: string) => void;
};

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!clientId || !buttonRef.current) {
      return;
    }

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          void apiRequest("/auth/google", {
            method: "POST",
            body: JSON.stringify({ credential: response.credential }),
          })
            .then(() => {
              notifySessionChanged();
              onSuccess();
            })
            .catch((error: unknown) => {
              onError(error instanceof ApiError ? error.message : "No se pudo iniciar sesión con Google.");
            });
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: Math.min(buttonRef.current.clientWidth, 380),
        text: "continue_with",
      });
      setReady(true);
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existingScript) {
      renderGoogleButton();
      existingScript.addEventListener("load", renderGoogleButton);
      return () => existingScript.removeEventListener("load", renderGoogleButton);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => onError("No se pudo cargar el inicio de sesión de Google.");
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [onError, onSuccess]);

  if (!clientId) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        El acceso con Google requiere configurar NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </p>
    );
  }

  return (
    <div
      ref={buttonRef}
      className={`min-h-11 w-full transition-opacity ${ready ? "opacity-100" : "opacity-60"}`}
      aria-label="Continuar con Google"
    />
  );
}

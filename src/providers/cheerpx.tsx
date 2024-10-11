"use client";

import { ICheerpX } from "@/app/types/cheerpx";
import Script from "next/script";
import { createContext, ReactNode, useContext, useState } from "react";

export type LoadingState = {
  loaded: false;
};

export type ErrorState = {
  loaded: true;
  error: Error;
};

export type LoadedState = {
  loaded: true;
  CheerpX: ICheerpX;
};

export type States = LoadingState | ErrorState | LoadedState;

export const cheerpxContext = createContext<States>({
  loaded: false,
});

type CheerpXWindow = Window & {
  CheerpX: ICheerpX;
};

export const CheerpxProvider = ({
  children,
  src,
}: {
  children: ReactNode;
  src: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [CheerpX, setCheerpX] = useState<ICheerpX | null>(null);

  const onLoad = () => {
    setLoaded(true);
    setCheerpX((window as unknown as CheerpXWindow).CheerpX);
  };

  const onError = (e: unknown) => {
    if (e instanceof Error) {
      setError(e);
    } else {
      setError(new Error(`Unknown error: ${e}`));
    }
  };

  return (
    <cheerpxContext.Provider
      value={
        loaded
          ? error
            ? { loaded: true, error }
            : { loaded: true, CheerpX: CheerpX! }
          : { loaded: false }
      }
    >
      {children}
      <Script onLoad={onLoad} onError={onError} src={src} />
    </cheerpxContext.Provider>
  );
};

export const useCheerpX = () => {
  return useContext(cheerpxContext);
};

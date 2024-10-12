"use client";

import supabase from "@/lib/supabase";
import { useAuth } from "./use-auth";

export const useRoom = () => {
  const auth = useAuth();

  const captchaNeeded = !auth.session && auth.loaded;

  const join = async (roomId: string, captchaToken: string) => {
    if (!auth.session) {
      await supabase.auth.signInAnonymously({ options: { captchaToken } });
    }
  };
  const create = async (captchaToken: string) => {
    if (!auth.session) {
      await supabase.auth.signInAnonymously({ options: { captchaToken } });
    }
  };

  return { join, create, captchaNeeded };
};

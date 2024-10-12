import supabase from "@/lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoaded(true);
    });

    const onAuthStateChange = async (
      event: AuthChangeEvent,
      session: Session | null
    ) => {
      setSession(session);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(onAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { loaded, session };
};

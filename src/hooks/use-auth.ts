import supabase from "@/lib/supabase";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const getUserIdOrNull = async () => {
    const session = await getSession();
    if (!session) return null;
    if (!session.user) return null;
    return session.user.id;
  };

  const getUserIdOrThrow = async () => {
    const userId = await getUserIdOrNull();
    if (!userId) throw new Error("No user id");
    return userId;
  };

  const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  };

  useEffect(() => {
    getSession().then((session) => {
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

  return { loaded, session, getUserIdOrNull, getUserIdOrThrow };
};

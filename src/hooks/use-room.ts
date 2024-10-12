"use client";

import { createRoomJoinCode } from "@/lib/export-room-join-code";
import supabase from "@/lib/supabase";
import { useState } from "react";
import { useAuth } from "./use-auth";

export const useRoom = () => {
  const [roomId, setRoomId] = useState<number | null>(null);
  const auth = useAuth();

  const captchaNeeded = !auth.session && auth.loaded;

  const join = async (roomCode: string, captchaToken: string | null) => {
    if (!auth.session) {
      if (!captchaToken) throw new Error("Captcha token required");
      await supabase.auth.signInAnonymously({ options: { captchaToken } });
    }
    const userId = await auth.getUserIdOrThrow();

    const room = await supabase
      .from("rooms")
      .select("id")
      .eq("join_code", roomCode)
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data || data.length === 0) throw new Error("No room found");
        const room = data[0].id;
        return room;
      });

    await supabase.from("players").insert([
      {
        room_id: room,
        user_id: userId,
        is_host: false,
      },
    ]);

    setRoomId(room);
  };

  const create = async (captchaToken: string | null) => {
    console.log("create room", { captchaToken });
    if (!auth.session) {
      if (!captchaToken) throw new Error("Captcha token required");
      await supabase.auth.signInAnonymously({ options: { captchaToken } });
    }

    const hostId = await auth.getUserIdOrThrow();

    const roomCode = createRoomJoinCode();
    await supabase
      .from("rooms")
      .insert([
        {
          join_code: roomCode,
          max_players: 10,
          host_id: hostId,
        },
      ])
      .then(({ error }) => {
        if (error) throw error;
      });

    const id = await supabase
      .from("rooms")
      .select("id")
      .eq("join_code", roomCode)
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data || data.length === 0) throw new Error("No room found");
        const room = data[0].id;
        return room;
      });

    await supabase
      .from("players")
      .insert([
        {
          room_id: id,
          user_id: hostId,
          is_host: true,
        },
      ])
      .then(({ error }) => {
        if (error) throw error;
      });

    setRoomId(id);
  };

  return { join, create, captchaNeeded, id: roomId };
};

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { env } from "@/env";
import { useRoom } from "@/hooks/use-room";
import { Turnstile } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [roomId, setRoomId] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const room = useRoom();

  const onRoomJoinClick = () => {
    if (!captchaToken) return;
    room.join(roomId, captchaToken);
  };

  return (
    <div className="grow flex flex-col items-center justify-center gap-6">
      <h1 className="font-bold text-4xl tracking-tighter">Product Name!</h1>
      <Card className="p-6 flex flex-col gap-3">
        <Input
          placeholder="Room Code"
          className="text-center"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        {room.captchaNeeded && (
          <Turnstile
            data-theme="dark"
            siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={(token) => {
              console.log("turnstile token", token);
              setCaptchaToken(token);
            }}
          />
        )}
        <Button onClick={onRoomJoinClick} disabled={!roomId || !captchaToken}>
          Join Room
        </Button>
        <p className="text-muted-foreground text-sm">
          {"Don't"} have a room code?{" "}
          <Link
            href="/create-room"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Create your own!
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Page;

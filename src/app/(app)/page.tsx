import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Page = () => {
  return (
    <div className="grow flex flex-col items-center justify-center gap-6">
      <h1 className="font-bold text-4xl tracking-tighter">Product Name!</h1>
      <Card className="p-6 flex flex-col gap-3">
        <Input placeholder="Room Code" className="text-center" />
        <Button>Join Room</Button>
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

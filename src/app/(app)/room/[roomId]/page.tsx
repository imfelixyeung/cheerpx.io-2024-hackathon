import { RoomIdParams } from "./params";

const Page = ({ params: { roomId } }: { params: RoomIdParams }) => {
  return <div>{roomId}</div>;
};

export default Page;

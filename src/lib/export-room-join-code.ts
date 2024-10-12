import { init } from "@paralleldrive/cuid2";

export const createRoomJoinCode = init({ random: Math.random, length: 6 });

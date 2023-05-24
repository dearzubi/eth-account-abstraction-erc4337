import { Client } from "userop";
import dotenv from "dotenv";
dotenv.config();

const client = await Client.init(
    process.env.RPC,
    process.env.ENTRYPOINT_ADDRESS,
);


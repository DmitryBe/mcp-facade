import { config } from 'dotenv';
config({
  path: '.env',
});

import { getRegisteredMcpServers, registerMcpServer } from "./db/queries";


const main = async () => {
    console.log("Hello, world!");

    console.log("process.env.POSTGRES_URL", process.env.POSTGRES_URL);

    await registerMcpServer("test", "http://localhost:3000");

    const servers = await getRegisteredMcpServers();
    console.log("servers", servers);
    
}

main();
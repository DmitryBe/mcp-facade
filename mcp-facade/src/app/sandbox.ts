import { config } from "./lib/config";

const main = async () => {
  console.log("Hello, world!", config.postgresUrl);
}

main();
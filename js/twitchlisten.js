import tmi from "tmi.js";

const params = new URLSearchParams(document.location.search);
let channelName = params.get("channel");

const client = new tmi.Client({
  channels: [channelName],
});

client.connect();

console.log(client);

client.on("message", (channel, tags, message, self) => {
  if (self) return;
  console.log(message);
});

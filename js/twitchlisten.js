import tmi from "tmi.js";

let channelName = getChannelParam();

function getChannelParam() {
  const params = new URLSearchParams(document.location.search);
  return params.get("channel");
}

function activateTwitch(channelName) {
  console.log("ACTIVATING TWITCH FOR CHANNEL ", channelName);
  document.title = `TwitchListen | ${channelName}`;

  const client = new tmi.Client({
    channels: [channelName],
  });

  client.connect();

  client.on("message", (channel, tags, message, self) => {
    if (self) return;
    console.log(message);
  });
}

function submitForm(event) {
  const channelName = getChannelParam();
  activateTwitch(channelName);
}

const form = document.querySelector("[data-form]");
form.addEventListener("submit", submitForm);

function hideForm() {
  form.remove();
}

if (getChannelParam() !== null) {
  activateTwitch(channelName);
  hideForm();
}

import tmi from "tmi.js";
import * as Tone from "tone";
import { getRandomEntry } from "@whitep4nth3r/get-random-entry";

function getChannelParam() {
  const params = new URLSearchParams(document.location.search);
  return params.get("channel");
}

function submitForm(event) {
  channelName = getChannelParam();
}

const notes = ["C", "D", "E", "G", "A"];
const octaves = ["2", "3", "4", "5", "6"];

let synth = null;
let channelName = getChannelParam();

function activateTwitch(channelName) {
  console.log("ACTIVATING TWITCH FOR CHANNEL ", channelName);
  document.title = `TwitchListen | ${channelName}`;

  if (synth !== null) {
    const client = new tmi.Client({
      channels: [channelName],
    });

    client.connect();

    client.on("chat", (channel, tags, message, self) => {
      console.log("MESSAGE");
      console.log(message);
      const newNote = getRandomEntry(notes) + getRandomEntry(octaves);
      synth.triggerAttackRelease(newNote, "8n");
    });
  } else {
    console.log("No synth found");
  }
}

/**
 * Listen button
 * Tone requires user interaction before we can activate the synth
 */
const button = document.querySelector("[data-button]");
// on load hide listen button
button.style.display = "none";

button.addEventListener("click", async () => {
  await Tone.start();
  console.log("audio is ready");
  // assign synth
  synth = new Tone.Synth().toDestination();
  button.textContent = "Listening";
  activateTwitch(channelName);
});

/**
 * Enter channel name form
 */
const form = document.querySelector("[data-form]");
form.addEventListener("submit", submitForm);

/**
 * On load, if we have a channel name param
 * we can hide the channel name form
 */
if (getChannelParam() !== null) {
  activateTwitch(channelName);
  form.remove();
  button.style.display = "block";
}

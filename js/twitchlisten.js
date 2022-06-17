import tmi from "tmi.js";
import * as Tone from "tone";
import { getRandomEntry } from "@whitep4nth3r/get-random-entry";

const ignoredUsers = ["p4nth3rb0t"]; //to do add ignored as url params

const notes = ["C", "D", "E", "G", "A"];
// for reference
const octaves = ["2", "3", "4", "5", "6"];

function calculateOctave(size) {
  const thresholds = ["250", "200", "150", "100", "50"];
  // calculate the closest threshold item to size
  const getClosestThreshold = (thresholds, size) =>
    thresholds.reduce((acc, threshold) => (Math.abs(size - threshold) < Math.abs(size - acc) ? threshold : acc));

  const closestItem = getClosestThreshold(thresholds, size);
  return thresholds.indexOf(closestItem) + 2;
}

function getChannelParam() {
  const params = new URLSearchParams(document.location.search);
  return params.get("channel");
}

function submitForm(event) {
  channelName = getChannelParam();
}

function addBubble(size) {
  const bubble = document.createElement("span");
  bubble.style.setProperty("--size", `${size}px`);
  //to do — put in random position at bottom of canvas
  //and then use animation to rise up

  canvas.appendChild(bubble);
}

let synth = null;
let channelName = getChannelParam();

function activateTwitch(channelName) {
  document.title = `TwitchListen | ${channelName}`;

  if (synth !== null) {
    const client = new tmi.Client({
      channels: [channelName],
    });

    client.connect();
    console.log("Listening to ", channelName);

    client.on("chat", (channel, tags, message, self) => {
      console.log("Message received: ", message);
      if (!ignoredUsers.includes(tags["display-name"])) {
        const newNote = getRandomEntry(notes) + calculateOctave(message.length);

        //to do — but that happens every now and then
        //Debug.ts:8 Uncaught Error: Start time must be strictly greater than previous start time
        synth.triggerAttackRelease(newNote, "8n");
        addBubble(message.length);
      } else {
        console.log("Ignoring user ", tags["display-name"]);
      }
    });
  } else {
    console.log("No synth found!");
  }
}

/**
 * Listen button
 * Tone requires user interaction before we can activate the synth
 */
const canvas = document.querySelector("[data-canvas]");
const unmuteMessage = document.querySelector("[data-unmute-message]");
// on load hide listen button
unmuteMessage.style.display = "none";

canvas.addEventListener("click", async () => {
  await Tone.start();
  console.log("Audio is ready!");
  // assign synth
  synth = new Tone.Synth().toDestination();
  unmuteMessage.remove();
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
  unmuteMessage.style.display = "block";
}

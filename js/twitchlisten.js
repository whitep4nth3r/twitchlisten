import tmi from "tmi.js";
import { getRandomEntry } from "@whitep4nth3r/get-random-entry";

const ignoredUsers = ["p4nth3rb0t"]; //to do add ignored as url params

const notes = ["d_flat", "e_flat", "g_flat", "a_flat", "b_flat"];

function calculateOctave(size) {
  const thresholds = ["120", "80", "50", "25", "10"];
  // calculate the closest threshold item to size
  const getClosestThreshold = (thresholds, size) =>
    thresholds.reduce((acc, threshold) => (Math.abs(size - threshold) < Math.abs(size - acc) ? threshold : acc));

  const closestItem = getClosestThreshold(thresholds, size);
  return thresholds.indexOf(closestItem) + 1;
}

function getChannelParam() {
  const params = new URLSearchParams(document.location.search);
  return params.get("channel");
}

function submitForm(event) {
  channelName = getChannelParam();
}

function addAudioElement(size) {
  const newNote = `${getRandomEntry(notes)}_${calculateOctave(size)}`;

  const audio = document.createElement("audio");
  audio.autoplay = true;
  const audioId = Math.random();
  audio.dataset.audioId = audioId;
  const source = document.createElement("source");

  source.setAttribute("src", `/${newNote}.mp3`);
  audio.appendChild(source);
  canvas.appendChild(audio);

  // Remove audio from DOM after 10s
  setTimeout(() => removeAudio(audioId), 10000);
}

function addBubble(size) {
  const bubble = document.createElement("span");
  bubble.style.setProperty("--size", `${size}px`);

  // assign random X position at bottom of canvas
  const moveX = (Math.random() * 100).toFixed();
  bubble.style.setProperty("--moveX", `${moveX}vw`);
  const bubbleId = Math.random();
  bubble.dataset.bubbleId = bubbleId;
  canvas.appendChild(bubble);

  // Remove bubble from DOM after 10s
  setTimeout(() => removeBubble(bubbleId), 10000);
}

function removeBubble(bubbleId) {
  document.querySelector("[data-bubble-id='" + bubbleId + "']").remove();
}

function removeAudio(audioId) {
  document.querySelector("[data-audio-id='" + audioId + "']").remove();
}

let activate = null;
let channelName = getChannelParam();

function activateTwitch(channelName) {
  document.title = `TwitchListen | ${channelName}`;

  if (activate) {
    const client = new tmi.Client({
      channels: [channelName],
    });

    client.connect();
    console.log("TwitchListen listening to ", channelName);

    client.on("chat", (channel, tags, message, self) => {
      console.log("Message received: ", message);
      if (!ignoredUsers.includes(tags["display-name"])) {
        addBubble(message.length);
        addAudioElement(message.length);
      } else {
        console.log("Ignoring user ", tags["display-name"]);
      }
    });
  } else {
    console.log("TwitchListen not activated!");
  }
}

/**
 * TODO — UNMUTE BUTTON
 * Listen button
 * Browser audio requires user interaction before it can play
 */
const canvas = document.querySelector("[data-canvas]");
const unmuteMessage = document.querySelector("[data-unmute-message]");
// on load hide listen button
unmuteMessage.style.display = "none";

canvas.addEventListener("click", async () => {
  console.log("Interaction found!");
  activate = true;
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

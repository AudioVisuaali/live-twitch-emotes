require("../css/app.css");

const emotesContainer = document.getElementById("kappa");

let emoteCount = 0;

function addPicture(url) {
  const positionX = Math.floor(Math.random() * 1100);
  emoteCount += 1;
  const img = document.createElement("img");
  img.src = url;
  img.style.left = `${positionX / 10 - 5}%`;
  emotesContainer.appendChild(img);
  setTimeout(() => {
    emotesContainer.removeChild(img);
  }, 1500);
  window.scroll({
    bottom: 0,
    behavior: "smooth"
  });
}

const ws = new WebSocket("wss://twitchstats-ws.streamelements.com/");

ws.onopen = e => {
  ws.send('{"command":"subscribe","data":{"room":"twitchstats:global:stats"}}');
};

ws.onmessage = function(event) {
  const { type, data } = JSON.parse(event.data);

  if (type !== "message") {
    return;
  }

  data.forEach(message => {
    message.forEach(emote => {
      if (emote.type !== "emotes") {
        return;
      }

      switch (emote.provider) {
        case "twitch":
          addPicture(
            `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`
          );
          break;

        case "bttv":
          addPicture(`https://cdn.betterttv.net/emote/${emote.id}/1x`);
          break;

        case "ffz":
          addPicture(`https://cdn.frankerfacez.com/emoticon/${emote.id}/1`);
          break;

        default:
          console.log(emote);
      }
    });
  });
};

ws.onclose = function(event) {
  if (event.wasClean) {
    alert(
      `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
    );
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert("[close] Connection died");
  }
};

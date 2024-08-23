document.addEventListener("DOMContentLoaded", () => {
  const EVENTS_DELAY = 20000;

  const games = {
    1: {
      name: "Riding Extreme 3D",
      appToken: "d28721be-fd2d-4b45-869e-9f253b554e50",
      promoId: "43e35910-c168-4634-ad4f-52fd764a843f",
    },
    2: {
      name: "Chain Cube 2048",
      appToken: "d1690a07-3780-4068-810f-9b5bbf2931b2",
      promoId: "b4170868-cef0-424f-8eb9-be0622e8e8e3",
    },
    3: {
      name: "My Clone Army",
      appToken: "74ee0b5b-775e-4bee-974f-63e7f4d5bacb",
      promoId: "fe693b26-b342-4159-8808-15e3ff7f8767",
    },
    4: {
      name: "Train Miner",
      appToken: "82647f43-3f87-402d-88dd-09a90025313f",
      promoId: "c4480ac7-e178-4973-8061-9ed5b2e17954",
    },
    5: {
      name: "Merge Away",
      appToken: "8d1cc2ad-e097-4b86-90ef-7a27e19fb833",
      promoId: "dc128d28-c45b-411c-98ff-ac7726fbaea4",
    },
    6: {
      name: "Twerk Race 3D",
      appToken: "61308365-9d16-4040-8bb0-2f4a4c69074c",
      promoId: "61308365-9d16-4040-8bb0-2f4a4c69074c",
    },
    7: {
        name: 'Polysphere',
        appToken: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
        promoId: '2aaf5aee-2cbc-47ec-8a3f-0962cc14bc71',
    },
    8: {
        name: 'Mow and Trim',
        appToken: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
        promoId: 'ef319a80-949a-492e-8ee0-424fb5fc20a6',
    },
    9: {
        name: 'Mud Racing',
        appToken: '8814a785-97fb-4177-9193-ca4180ff9da8',
        promoId: '8814a785-97fb-4177-9193-ca4180ff9da8',
    }
  };

  const gameOptions = document.querySelectorAll(".game-option");
  const keyCountGroup = document.getElementById("keyCountGroup");
  const keyCountGroupUpHr = document.getElementById("keyCountGroupUpHr");
  const keyCountGroupDownHr = document.getElementById("keyCountGroupDownHr");
  const keyRange = document.getElementById("keyRange");
  const keyValue = document.getElementById("keyValue");
  const startBtn = document.getElementById("startBtn");
  const keyCountLabel = document.getElementById("keyCountLabel");
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressLog = document.getElementById("progressLog");
  const keyContainer = document.getElementById("keyContainer");
  const keysList = document.getElementById("keysList");
  const copyAllBtn = document.getElementById("copyAllBtn");
  const generatedKeysTitle = document.getElementById("generatedKeysTitle");
  const copyStatus = document.getElementById("copyStatus");

  let selectedGame = null;

  gameOptions.forEach((option) => {
    option.addEventListener("click", () => {
      gameOptions.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedGame = option.dataset.game;

      keyCountGroup.classList.remove("hidden");
      keyCountGroupUpHr.classList.remove("hidden");
      keyCountGroupDownHr.classList.remove("hidden");
      startBtn.classList.remove("hidden");
    });
  });

  keyRange.addEventListener("input", () => {
    keyValue.innerText = keyRange.value;
  });

  startBtn.addEventListener("click", async () => {
    const keyCount = parseInt(keyRange.value);
    if (!selectedGame) {
      alert("Please select a game first.");
      return;
    }

    const gameChoice = parseInt(selectedGame);
    const game = games[gameChoice];

    // Hide the form sections
    document.querySelector(".grid-container").style.display = "none";
    keyCountGroup.classList.add("hidden");

    keyCountLabel.innerText = `ŲŖŲ¹ŲÆŲ§ŲÆ Ś©Ł„ŪŲÆŁ‡Ų§ : ${keyCount}`;

    progressBar.style.width = "0%";
    progressText.innerText = "0%";
    progressLog.innerText = "Ų´Ų±ŁŲ¹ ...";
    progressContainer.classList.remove("hidden");
    keyContainer.classList.add("hidden");
    generatedKeysTitle.classList.add("hidden");
    keysList.innerHTML = "";
    copyAllBtn.classList.add("hidden");
    startBtn.classList.add("hidden");
    startBtn.disabled = true;

    let progress = 0;
    const updateProgress = (increment, message) => {
      progress += increment;
      progressBar.style.width = `${progress}%`;
      progressText.innerText = `${progress}%`;
      progressLog.innerText = message;
    };

    const generateKeyProcess = async () => {
      const clientId = generateClientId();
      let clientToken;
      try {
        clientToken = await login(clientId, game.appToken);
      } catch (error) {
        alert(`Failed to login: ${error.message}`);
        startBtn.disabled = false;
        return null;
      }

      for (let i = 0; i < 20; i++) {
     
        const hasCode = await emulateProgress(clientToken, game.promoId);
        updateProgress(5 / keyCount, "Ų´ŲØŪŁ‡ Ų³Ų§Ų²Ū ŁŲ±Ų¢ŪŁ†ŲÆ ...");
        if (hasCode) {
          break;
        }

        if (game.promoId == "fe693b26-b342-4159-8808-15e3ff7f8767") {
          await sleep(120000);
        } else {
          await sleep(EVENTS_DELAY);
        }

      }

      try {
        const key = await generateKey(clientToken, game.promoId);
        updateProgress(7 / keyCount, " ŲŖŁŁ„ŪŲÆ Ś©Ł„ŪŲÆ ...");
        return key;
      } catch (error) {
        alert(`Failed to generate key: ${error.message}`);
        return null;
      }
    };

    const keys = await Promise.all(
      Array.from({ length: keyCount }, generateKeyProcess)
    );

    if (keys.length > 1) {
      keysList.innerHTML = keys
        .filter((key) => key)
        .map(
          (key) =>
            `<div class="key-item">
                    <input type="text" value="${key}" readonly>
                    <button class="copyKeyBtn" data-key="${key}">Ś©Ł¾Ū Ś©Ł„ŪŲÆ</button>
                </div>`
        )
        .join("");
      copyAllBtn.classList.remove("hidden");
    } else if (keys.length === 1) {
      keysList.innerHTML = `<div class="key-item">
                    <input type="text" value="${keys[0]}" readonly>
                    <button class="copyKeyBtn" data-key="${keys[0]}">Ś©Ł¾Ū Ś©Ł„ŪŲÆ</button>
                </div>`;
    }

    keyContainer.classList.remove("hidden");
    generatedKeysTitle.classList.remove("hidden");
    document.querySelectorAll(".copyKeyBtn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const key = event.target.getAttribute("data-key");

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(key)
            .then(() => {
              copyStatus.classList.remove("hidden");
              setTimeout(() => copyStatus.classList.add("hidden"), 2000);
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
            });
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = key;
          textArea.style.position = "fixed";
          textArea.style.top = "0";
          textArea.style.left = "0";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          try {
            const successful = document.execCommand("copy");
            const msg = successful ? "successful" : "unsuccessful";
            console.log("Fallback: Copying text command was " + msg);
            if (successful) {
              copyStatus.classList.remove("hidden");
              setTimeout(() => copyStatus.classList.add("hidden"), 2000);
            }
          } catch (err) {
            console.error("Fallback: Oops, unable to copy", err);
          }

          document.body.removeChild(textArea);
        }
      });
    });
    copyAllBtn.addEventListener("click", () => {
      const keysText = keys.filter((key) => key).join("\n");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(keysText)
          .then(() => {
            copyStatus.classList.remove("hidden");
            setTimeout(() => copyStatus.classList.add("hidden"), 2000);
          })
          .catch((err) => {
            console.error("Failed to copy text: ", err);
          });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = keysText;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand("copy");
          const msg = successful ? "successful" : "unsuccessful";
          console.log("Fallback: Copying text command was " + msg);
          if (successful) {
            copyStatus.classList.remove("hidden");
            setTimeout(() => copyStatus.classList.add("hidden"), 2000);
          }
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }

        document.body.removeChild(textArea);
      }
    });

    progressBar.style.width = "100%";
    progressText.innerText = "100%";
    progressLog.innerText = "";

    document.querySelector(".grid-container").style.display = "grid";
    startBtn.disabled = false;
  });

  const generateClientId = () => {
    const timestamp = Date.now();
    const randomNumbers = Array.from({ length: 19 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    return `${timestamp}-${randomNumbers}`;
  };

  const login = async (clientId, appToken) => {
    const response = await fetch(
      "https://api.gamepromo.io/promo/login-client",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appToken,
          clientId,
          clientOrigin: "deviceid",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to login");
    }

    const data = await response.json();
    return data.clientToken;
  };

  const emulateProgress = async (clientToken, promoId) => {
    const response = await fetch(
      "https://api.gamepromo.io/promo/register-event",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promoId,
          eventId: generateUUID(),
          eventOrigin: "undefined",
        }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.hasCode;
  };

  const generateKey = async (clientToken, promoId) => {
    const response = await fetch("https://api.gamepromo.io/promo/create-code", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clientToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        promoId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate key");
    }

    const data = await response.json();
    return data.promoCode;
  };

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const delayRandom = () => Math.random() / 3 + 1;
});

      appToken: "8814a785-97fb-4177-9193-ca4180ff9da8",
      promoId: "8814a785-97fb-4177-9193-ca4180ff9da8",
      timing: 20000, // 20 seconds
      attempts: 20,
    },
    10: {
      name: "Cafe Dash",
      appToken: "bc0971b8-04df-4e72-8a3e-ec4dc663cd11",
      promoId: "bc0971b8-04df-4e72-8a3e-ec4dc663cd11",
      timing: 20000, // 20 seconds
      attempts: 20,
    },
    11: {
      name: "Zoopolis",
      appToken: "b2436c89-e0aa-4aed-8046-9b0515e1c46b",
      promoId: "b2436c89-e0aa-4aed-8046-9b0515e1c46b",
      timing: 20000, // 20 seconds
      attempts: 20,
    },
    12: {
      name: "Gangs Wars",
      appToken: "b6de60a0-e030-48bb-a551-548372493523",
      promoId: "c7821fa7-6632-482c-9635-2bd5798585f9",
      timing: 40000, // 40 seconds
      attempts: 30,
    },
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

    keyCountLabel.innerText = `تعداد کلیدها : ${keyCount}`;

    progressBar.style.width = "0%";
    progressText.innerText = "0%";
    progressLog.innerText = "شروع ...";
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
        updateProgress(5 / keyCount, "شبیه سازی فرآیند ...");
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
        updateProgress(7 / keyCount, " تولید کلید ...");
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
                    <button class="copyKeyBtn" data-key="${key}">کپی کلید</button>
                </div>`
        )
        .join("");
      copyAllBtn.classList.remove("hidden");
    } else if (keys.length === 1) {
      keysList.innerHTML = `<div class="key-item">
                    <input type="text" value="${keys[0]}" readonly>
                    <button class="copyKeyBtn" data-key="${keys[0]}">کپی کلید</button>
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

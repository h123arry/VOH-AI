const chatBox =
  document.getElementById("chat-box");

const input =
  document.getElementById("message");

const typing =
  document.getElementById("typing");

const sendButton =
  document.getElementById("send-btn");

let isSending = false;

window.onload = () => {

  input.focus();

  const savedChats =
    localStorage.getItem("voh_chats");

  if (savedChats) {

    chatBox.innerHTML =
      savedChats;

    chatBox.scrollTop =
      chatBox.scrollHeight;

  } else {

    addMessage(
      "Hey 👋 I'm VOH AI, your smart assistant. How can I help you today?",
      "ai"
    );

  }

};

function saveChats() {

  localStorage.setItem(
    "voh_chats",
    chatBox.innerHTML
  );

}

function getTime() {

  return new Date()
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

}

function copyMessage(button) {

  const message =
    button.parentElement
      .querySelector(
        ".text"
      ).innerText;

  navigator.clipboard.writeText(
    message
  );

  button.innerText =
    "Copied";

  setTimeout(() => {

    button.innerText =
      "Copy";

  }, 1000);

}

function addMessage(
  message,
  sender
) {

  const msgDiv =
    document.createElement("div");

  msgDiv.classList.add(
    "message"
  );

  msgDiv.classList.add(sender);

  const label =
    sender === "user"
      ? "You"
      : "VOH AI";

  msgDiv.innerHTML = `

    <div class="label">
      ${label}
    </div>

    <div class="text">
      ${message}
    </div>

    <div class="timestamp">
      ${getTime()}
    </div>

    <button
      class="copy-btn"
      onclick="copyMessage(this)"
    >
      Copy
    </button>

  `;

  chatBox.appendChild(
    msgDiv
  );

  chatBox.scrollTop =
    chatBox.scrollHeight;

  saveChats();

}

function setLoading(
  loading
) {

  isSending = loading;

  sendButton.disabled =
    loading;

  sendButton.innerText =
    loading
      ? "..."
      : "Send";

}

async function sendMessage() {

  if (isSending) return;

  const message =
    input.value.trim();

  if (!message) return;

  addMessage(
    message,
    "user"
  );

  input.value = "";

  typing.style.display =
    "block";

  setLoading(true);

  try {

    const response =
      await fetch("/chat", {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message: message
        })

      });

    const data =
      await response.json();

    const delay =
      Math.min(
        3000,
        Math.max(
          1000,
          data.reply.length *
            15
        )
      );

    setTimeout(() => {

      typing.style.display =
        "none";

      addMessage(
        data.reply,
        "ai"
      );

      setLoading(false);

    }, delay);

  } catch (error) {

    typing.style.display =
      "none";

    addMessage(
      "Something went wrong 😕",
      "ai"
    );

    setLoading(false);

  }

}

input.addEventListener(
  "keypress",
  function(event) {

    if (
      event.key ===
      "Enter"
    ) {

      sendMessage();

    }

  }
);

function clearChat() {

  localStorage.removeItem(
    "voh_chats"
  );

  chatBox.innerHTML = "";

  addMessage(
    "Chat cleared 🧹",
    "ai"
  );

}

function startVoice() {

  if (
    !(
      "webkitSpeechRecognition"
      in window
    )
  ) {

    alert(
      "Voice recognition is not supported on this browser."
    );

    return;

  }

  const recognition =
    new webkitSpeechRecognition();

  recognition.lang =
    "en-US";

  input.placeholder =
    "🎤 Listening...";

  recognition.onstart =
    function() {

      navigator.vibrate?.(
        100
      );

    };

  recognition.onresult =
    function(event) {

      const transcript =
        event.results[0][0]
          .transcript;

      input.value =
        transcript;

      input.placeholder =
        "Ask VOH AI anything...";

      input.focus();

    };

  recognition.onerror =
    function() {

      input.placeholder =
        "Ask VOH AI anything...";

    };

  recognition.onend =
    function() {

      input.placeholder =
        "Ask VOH AI anything...";

    };

  recognition.start();

}

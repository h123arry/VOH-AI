const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(message, sender) {

  const msgDiv = document.createElement("div");

  msgDiv.classList.add("message");

  if (sender === "user") {
    msgDiv.classList.add("user-message");
  } else {
    msgDiv.classList.add("bot-message");
  }

  msgDiv.innerText = message;

  chatBox.appendChild(msgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  return msgDiv;
}

async function sendMessage() {

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  // Loading message
  const loadingMsg =
    addMessage("VOH AI is thinking...", "bot");

  try {

    const response = await fetch("/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message
      })

    });

    const data = await response.json();

    // Replace loading text
    loadingMsg.innerText = data.reply;

  }

  catch (error) {

    loadingMsg.innerText =
      "Error connecting to VOH AI 🚀";

  }

}

sendBtn.addEventListener("click", sendMessage);

// Press Enter to send
input.addEventListener("keypress", function(e) {

  if (e.key === "Enter") {
    sendMessage();
  }

});


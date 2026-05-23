const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const typing = document.getElementById("typing");

function addMessage(message, sender) {

  const msgDiv = document.createElement("div");

  msgDiv.classList.add("message");

  if (sender === "user") {
    msgDiv.classList.add("user");
  } else {
    msgDiv.classList.add("ai");
  }

  msgDiv.innerText = message;

  chatBox.appendChild(msgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  typing.style.display = "block";

  try {

    const response = await fetch("/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: message
      })

    });

    const data = await response.json();

    setTimeout(() => {

  typing.style.display = "none";

  addMessage(data.reply, "ai");

}, 1500);

  } catch (error) {

    typing.style.display = "none";

    addMessage("Error getting response.", "ai");

  }

}

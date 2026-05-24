const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const typing = document.getElementById("typing");

// Load saved chats
window.onload = () => {

  const savedChats =
    localStorage.getItem("voh_chats");

  if (savedChats) {

    chatBox.innerHTML = savedChats;

    chatBox.scrollTop =
      chatBox.scrollHeight;

  }

};

function saveChats() {

  localStorage.setItem(
    "voh_chats",
    chatBox.innerHTML
  );

}

function addMessage(message, sender) {

  const msgDiv =
    document.createElement("div");

  msgDiv.classList.add("message");

  if (sender === "user") {

    msgDiv.classList.add("user");

  } else {

    msgDiv.classList.add("ai");

  }

  msgDiv.innerText = message;

  chatBox.appendChild(msgDiv);

  chatBox.scrollTop =
    chatBox.scrollHeight;

  saveChats();

}

async function sendMessage() {

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  typing.style.display = "block";

  try {

    const response = await fetch(
      "/chat",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          message: message
        })

      }
    );

    const data = await response.json();

    setTimeout(() => {

      typing.style.display = "none";

      addMessage(data.reply, "ai");

    }, 1500);

  } catch (error) {

    typing.style.display = "none";

    addMessage(
      "Error getting response.",
      "ai"
    );

  }

}

input.addEventListener(
  "keypress",
  function(event) {

    if (event.key === "Enter") {

      sendMessage();

    }

  }
);

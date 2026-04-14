/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Conversation history (bonus points)
let messages = [
  {
    role: "system",
    content:
      "You are a L'Oréal beauty assistant. Only answer questions about skincare, makeup, haircare, and beauty routines. If unrelated, politely refuse.",
  },
];

// Initial message
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! How can I help you today?</div>`;

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Show user message
  const userDiv = document.createElement("div");
  userDiv.className = "msg user";
  userDiv.textContent = userMessage;
  chatWindow.appendChild(userDiv);

  // Add to history
  messages.push({
    role: "user",
    content: userMessage,
  });

  userInput.value = "";

  try {
    // 🔥 CALL YOUR CLOUDFLARE WORKER
    const response = await fetch(
      "https://broken-band-6c57.cherrygoyal162.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages,
        }),
      },
    );

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Show bot reply
    const botDiv = document.createElement("div");
    botDiv.className = "msg ai";
    botDiv.textContent = botReply;
    chatWindow.appendChild(botDiv);

    // Save bot reply
    messages.push({
      role: "assistant",
      content: botReply,
    });

    // Auto scroll
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } catch (error) {
    console.error(error);

    const errorDiv = document.createElement("div");
    errorDiv.className = "msg ai";
    errorDiv.textContent = "⚠️ Error connecting to AI.";
    chatWindow.appendChild(errorDiv);
  }
});

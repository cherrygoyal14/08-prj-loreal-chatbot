/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Store conversation (for bonus points)
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

  // Add user message to UI
  const userDiv = document.createElement("div");
  userDiv.className = "msg user";
  userDiv.textContent = userMessage;
  chatWindow.appendChild(userDiv);

  // Add to conversation history
  messages.push({
    role: "user",
    content: userMessage,
  });

  userInput.value = "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    // Add bot message to UI
    const botDiv = document.createElement("div");
    botDiv.className = "msg ai";
    botDiv.textContent = botReply;
    chatWindow.appendChild(botDiv);

    // Save bot reply (for memory bonus)
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

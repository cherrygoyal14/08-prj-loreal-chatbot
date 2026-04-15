/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Store conversation */
let messages = [
  {
    role: "system",
    content:
      "You are a L'Oréal beauty assistant. Only answer questions about skincare, makeup, haircare, and beauty routines. If unrelated, politely refuse.",
  },
];

/* Initial message */
addMessage("ai", "👋 Hello! How can I help you today?");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Add user message
  addMessage("user", userMessage);
  userInput.value = "";

  // Add to history
  messages.push({
    role: "user",
    content: userMessage,
  });

  // Show typing indicator
  const typingDiv = addMessage("ai", "⏳ Typing...");

  try {
    const response = await fetch(
      "https://broken-band-6c57.cherrygoyal162.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const data = await response.json();

    // Remove typing message
    typingDiv.remove();

    const aiReply =
      data.choices?.[0]?.message?.content || "⚠️ No response from AI.";

    // Add AI message
    addMessage("ai", aiReply);

    // Save AI response
    messages.push({
      role: "assistant",
      content: aiReply,
    });
  } catch (error) {
    typingDiv.remove();
    addMessage("ai", "⚠️ Error connecting to AI.");
    console.error(error);
  }
});

/* Helper to add messages */
function addMessage(type, text) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.textContent = text;

  chatWindow.appendChild(div);

  // Auto scroll
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return div;
}

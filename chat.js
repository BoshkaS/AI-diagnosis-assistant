const button = document.getElementById("button");

fetch("/message")
  .then((res) => res.json())
  .then((messages) => {
    const chat = document.getElementById("chat");
    messages.forEach((message) => {
      const chatMessage = document.createElement("li");
      chatMessage.innerHTML = `<p class="${message.role}">${message.content}</p>`;
      chat.appendChild(chatMessage);
    });
  });

button.addEventListener("click", () => {
  const input = document.getElementById("input");
  const message = input.value;
  const chat = document.getElementById("chat");
  const chatMessage = document.createElement("li");
  chatMessage.innerHTML = `<p class="user">${message}</p>`;
  chat.appendChild(chatMessage);
  console.log(message);
  fetch("/message", {
    method: "POST",
    body: JSON.stringify({ message }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const botMessage = document.createElement("li");
      botMessage.innerHTML = `<p class="assistant">${data.content}</p>`;
      chat.appendChild(botMessage);
    });
});
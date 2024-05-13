const button = document.getElementById('button')

fetch('/message')
  .then((res) => res.json())
  .then((messages) => {
    const chat = document.getElementById('chat')
    messages.forEach((message) => {
      const chatMessage = document.createElement('li')
      chatMessage.innerHTML = `<p class="${message.role}">${message.content}</p>`
      chat.appendChild(chatMessage)
    })
  })

button.addEventListener('click', () => {
  const input = document.getElementById('input')
  const message = input.value
  const chat = document.getElementById('chat')
  const chatMessage = document.createElement('li')
  chatMessage.innerHTML = `<p class="user">${message}</p>`
  chat.appendChild(chatMessage)
  console.log(message)
  fetch('/message', {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      const botMessage = document.createElement('li')
      botMessage.innerHTML = `<p class="assistant">${data.content}</p>`
      chat.appendChild(botMessage)
    })
})

fetch('/reviews')
  .then((res) => {
    //console.log(res)
    return res.json()
  })
  .then((content) => {
    //console.log(content)
    //const reviews = JSON.parse(content)
    //console.log(reviews)
    const list = document.getElementById('reviewList')
    content.forEach((review) => {
      const listReview = document.createElement('li')
      listReview.innerHTML = `<p style="color:${(function () {
        switch (review.type) {
          case 'positive':
            return 'green'
          case 'negative':
            return 'red'
          case 'neutral':
            return 'gray'
        }
      })()}">${review.content}</p>`
      list.appendChild(listReview)
    })
  })

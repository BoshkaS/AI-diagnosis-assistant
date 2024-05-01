const express = require("express");
const path = require("path");
const OpenAI = require("openai");

// Create an Express application
const app = express();
const port = 2000; // Port number on which server will run

const openai = new OpenAI({
    baseURL: 'http://localhost:1234/v1',
    apiKey: 'not-needed',
})

const newMessage = async (history, message) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [...history, message],
    model: "gpt-3.5-turbo",
    // model: 'gpt-4',
  });

  return chatCompletion.choices[0].message;
};

const formatMessage = (userInput) => ({ role: "user", content: userInput });

const history = [
  {
    role: "system",
    content:
      "You are a helpful Healthcare Diagnosis Assistant AI assistant that helps to determine diagnosis. If somebody asks you something not related to the health topic, write I can't answer questions that are not related to healt topic." ,
      //"Our product about AI-powered solution that assists medical professionals in delivering accurate diagnoses and personalized treatment recommendations. Leveraging advanced algorithms and vast medical knowledge, the AI Diagnosis Assistant enhances diagnostic accuracy, empowers clinical decision-making, and improves patient outcomes. You need to answer about our product." ,
  },
];

const imagesPath = path.join(__dirname, 'images');
const audioPath = path.join(__dirname, 'audio'); // Add this line for audio directory

// Serve static files from the 'images' directory
app.use('/images', express.static(imagesPath));

// Serve static files from the 'audio' directory
app.use('/audio', express.static(audioPath));


// Route to serve images based on the image name in the URL
app.get('/get-image', (req, res) => {
    const imageName = req.query.name; // Get the image name from the query string
    if (!imageName) {
        return res.status(400).send('Image name is required');
    }

    const imagePath = path.join(imagesPath, imageName);
    res.sendFile(imagePath);
});

app.use(express.json());
// Define a route for serving index.html
app.get("/", (req, res) => {
  // Send index.html as the response
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/chat.js", (req, res) => {
  // Send index.html as the response
  res.sendFile(path.join(__dirname, "chat.js"));
});

app.post("/message", async (req, res) => {
    console.log(req.body);
  const message = formatMessage(req.body.message);
  const response = await newMessage(history, message);
  history.push(message, response);
  return res.send(response);
});

app.get("/message", (req, res) => {
  return res.send(history.slice(1));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
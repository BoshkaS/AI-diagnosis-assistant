const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const port = 3000;

// Database connection configuration
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "AIproject",
    password: "Vitavika2004",
    port: 5432,
});
  
// Facebook API credentials
const facebookConfig = {
    page_access_token: 'EAAGHPh606lQBO7RkFIb3oAuo7oymE2h4od8byfqqZAeZAdI1vzQ4XdWA1c1foa7ppmPEF2xWuyg5wlYolRsBeO89mYob4GNKfBZB4LeZA1ZC0qR82bGqp06HDnN4qO5RDcQ4oQYn8uTm5VZB4tORRyxQReaQvOk0E8lkGx1SlrBbbPsZCCRJ3Al62gA1LDQB6Tk',
    page_id: '291798220689054'
};

// Function to fetch post details from the database
async function fetchPostDetailsFromDB() {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT title, content, author FROM posts ORDER BY id DESC LIMIT 1");
        client.release(); // Release the client back to the pool
        return result.rows[0]; // Return the latest post details
    } catch (error) {
        console.error("Error fetching post details from database:", error);
        throw error;
    }
}

// Function to post content to Facebook page
async function postToFacebookPage(content) {
    const { title, content: description, author } = content;
    const post = `${title}: ${description} by ${author}`;

    try {
        const response = await axios.post(`https://graph.facebook.com/${facebookConfig.page_id}/feed`, {
            message: post,
            access_token: facebookConfig.page_access_token
        });
        console.log("Post on Facebook page successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error posting on Facebook page:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Route to trigger fetching post details from the database and posting to Facebook page
app.get("/post-content", async (req, res) => {
    try {
        // Fetch post details from the database
        const postDetails = await fetchPostDetailsFromDB();
        // Post to Facebook page
        const response = await postToFacebookPage(postDetails);
        
        res.send("Content posted successfully to Facebook page!");
    } catch (error) {
        console.error("Error posting content:", error);
        res.status(500).send("Error posting content to Facebook page");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

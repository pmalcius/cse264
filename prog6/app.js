// Paulius Malcius pam226 

const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
let words = [];

async function loadWords() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'words.txt'), 'utf8');
        words = data.split(/\s+/);
    } catch (err) {
        console.error("Error reading words file:", err);
    }
}

app.use(express.static(path.resolve(__dirname, "public")));

// Route to get a random word
app.get("/random-word", (req, res) => {
    if (words.length === 0) {
        return res.status(404).send("No words available");
    }
    const randomIndex = Math.floor(Math.random() * words.length);
    res.json({ word: words[randomIndex] });
});

app.listen(3000, async () => {
    await loadWords();
    console.log("Server started on port 3000");
});

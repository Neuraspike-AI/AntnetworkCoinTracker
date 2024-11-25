import express from 'express';
import path from 'path';
import internal from 'stream';
import { fileURLToPath } from 'url';

const app = express();

// Helper to manage __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let timer = 0; // Timer value in seconds
let timerRunning = false;
let interval;
let timerInterval;

let hasStarted = false;
let period = null;

let timeAtStart = null;

console.log("Starting Server...")
console.log("Timer starts")

app.get("/get_time", (req, res) => {
    res.json({hasStarted, period, timeAtStart})
}); 

function startTimer() {
    if (!hasStarted && period == null && timeAtStart == null) {
        console.log(Date.now())
        timeAtStart = Date.now();
    }
}

startTimer();

// API to start the timer
app.get('/start', (req, res) => {
    console.log("Timer started")
    if (!timerRunning) {
        console.log("igh");
        timerRunning = true;
        interval = setInterval(() => {
            timer++;
        }, 1000);
    }
    res.json({ message: 'Timer started' });
});

// API to get the current timer value
app.get('/timer', (req, res) => {
    res.json({ timer });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/stop', (req, res) => {
    console.log("Timer stopped")
    clearInterval(interval);
    interval = null
    timerRunning = false;
    res.json({timerRunning});
});

// Serve static files (e.g., CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
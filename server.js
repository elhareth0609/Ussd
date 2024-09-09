const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

// Serve static files (like CSS, JS) from the "public" directory
app.use(express.static('public'));

// Use body-parser to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Handle USSD request
app.post('/send-ussd', (req, res) => {
    const ussdCode = req.body.ussd_code;

    exec(`gammu --config C:/gammurc.ini getussd ${ussdCode}`, (error, stdout, stderr) => {
        res.send({ ussd_response: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

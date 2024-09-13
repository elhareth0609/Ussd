// const express = require('express');
// const { exec } = require('child_process');
// const path = require('path');
// const bodyParser = require('body-parser');

// const app = express();
// const port = 8000;

// // Serve static files (like CSS, JS) from the "public" directory
// app.use(express.static('public'));

// // Use body-parser to handle POST data
// app.use(bodyParser.urlencoded({ extended: true }));

// // Serve the HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '/public/index.html'));
// });

// // Handle USSD request
// app.post('/send-ussd', (req, res) => {
//     const ussdCode = req.body.ussd_code;

//     exec(`gammu --config C:/gammurc.ini getussd ${ussdCode}`, (error, stdout, stderr) => {
//         res.send({ ussd_response: stdout });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });


const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const ngrok = require('ngrok');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;
const iniPath = process.env.Path;
const serverUrl = process.env.serverUrl;
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

    exec(`gammu --config ${iniPath} getussd ${ussdCode}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send({ ussd_response: `Error executing USSD: ${stderr}` });
        } else {
            res.send({ ussd_response: stdout });
        }
    });
});

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);

    try {
        const url = await ngrok.connect({
            addr: port,
            authtoken: process.env.NGROK_TOKEN
        });
        console.log(`ngrok tunnel is open at ${url}`);

        axios.post(`${serverUrl}/api/store-url`, {
            ngrok_url: url
        })
        .then(response => {
            console.log('URL sent to Laravel:', response.data);
        })
        .catch(error => {
            console.error('Error sending URL to Laravel:', error);
        });

    } catch (err) {
        console.error("Error starting ngrok:", err);
    }
});

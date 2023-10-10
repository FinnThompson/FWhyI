const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const cors = require('cors');


const app = express();
const PORT = 3005;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 204,
};

app.use(cors());
app.use(bodyParser.json());
console.log("hello");

app.get('/favicon.ico', (req, res) => {
    // Send an empty response for favicon.ico requests to prevent the 404 error
    res.status(204).end();
});

app.get('/', (req, res) => {
    res.send('Hello, Express server is running!');
});

app.post('/analyze-fact', (req, res) => {
    const { text } = req.body;
    console.log(text);
    const pythonScriptPath = './factAnalyzer.py';
   

    const command = `python3 ${pythonScriptPath} "${text}"`;
    exec(command, (error, stdout, stderr) => {
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Failed to analyze the fact.' });
        }
        
        const result = JSON.parse(stdout);
        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('Request received');
    res.send('Hello from Docker Container!');
});

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing
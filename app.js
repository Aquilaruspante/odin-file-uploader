const express = require('express');
const path = require('node:path');

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.listen(3000, (error) => {
    if (error) console.log('Failed to start server', error);

    console.log('Server listetning at posrt 3000!');
});
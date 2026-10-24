const express = require('express');
const path = require('node:path');

const app = express();

/*------------------------------------------------ Config ----------------------------------*/

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/*----------------------------------------------- Routes -------------------------------*/

app.get('/', (req, res) => {
    res.render('home');
});

/*------------------------------------------------ Server launch ---------------------------*/

app.listen(3000, (error) => {
    if (error) console.log('Failed to start server', error);

    console.log('Server listetning at port 3000!');
});
const express = require('express');
const path = require('node:path');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { prisma } = require('./db/prisma.js');

const userRouter = require('./routes/userRoutes.js');

const app = express();

/*------------------------------------------------ Config ----------------------------------*/

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/* ------------------------------------------------- Session management -------------------------*/

app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
    secret: 'not a good secret',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined
        }
    )
}));

/*----------------------------------------------- Routes -------------------------------*/

app.get('/', (req, res) => {
    res.render('home');
});

app.use('/user', userRouter);

/*------------------------------------------------ Server launch ---------------------------*/

app.listen(3000, (error) => {
    if (error) console.log('Failed to start server', error);

    console.log('Server listetning at port 3000!');
});
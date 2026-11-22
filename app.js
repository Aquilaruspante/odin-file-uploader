const express = require('express');
const path = require('node:path');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { prisma } = require('./db/prisma.js');
const passport = require('passport');
const methodOverride = require('method-override');


const userRouter = require('./routes/userRoutes.js');
const foldersRoute = require('./routes/foldersRoute.js');
const adminRoutes = require('./routes/adminRoutes.js');
const shareRoutes = require('./routes/shareRoutes.js')

const { isAuth, isAdmin } = require('./middleware.js');
const ExpressError = require('./ExpressError.js');

const app = express();

/*------------------------------------------------ Config ----------------------------------*/

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ static: true }));
app.set('trust proxy', 1); // allows proxy to collect req.protocol

app.use(methodOverride('_method'));

/* ------------------------------------------------- Session management -------------------------*/

app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true
    },
    secret: process.env.SESSION_SECRET || 'not a good secret',
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

require('./config/passport.js')
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    if (req.session.messages) {
        res.locals.messages = req.session.messages;
        delete req.session.messages;
    };
    next();
});

/*----------------------------------------------- Routes -------------------------------*/

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('home');
    } else {
        res.redirect('/users/login');
    };
});

app.use('/users', userRouter);

app.use('/folders', isAuth, foldersRoute);

app.use('/admin', isAuth, isAdmin, adminRoutes);

app.use('/share', shareRoutes);

app.all('/{*splat}', (req, res) => {
    const status = '404';
    res.status(404).render('error', { status, message: 'Page not found!' });
});


app.use((err, req, res, next) => {
    console.log(err);

    const status = err instanceof ExpressError ? err.status : 500;
    const message = err instanceof ExpressError ? err.message : 'Internal server error';

    res.status(status || 500).render('error', { status, message });
});

/*------------------------------------------------ Server launch ---------------------------*/

app.listen(3000, (error) => {
    if (error) console.log('Failed to start server', error);

    console.log('Server listetning at port 3000!');
});
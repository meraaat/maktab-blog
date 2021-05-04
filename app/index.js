import passport from 'passport';
import routes from './routes/index.js';
import chalk from 'chalk';
import autoBind from 'auto-bind';
import config from './config/index.js';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParse from 'cookie-parser';
import flash from 'connect-flash';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import ExpressEjsLayouts from 'express-ejs-layouts';
import mongoose from 'mongoose';
import http from 'http';
import convert from './helper/convert.js';
import methodOverride from 'method-override';
import * as passportLocal from './passport/passport-local.js';
import * as passportGoogle from './passport/passport-google.js';
import moment from 'moment-jalaali';
moment.loadPersian({dialect: 'persian-modern', usePersianDigits: true});

export default class {
    constructor() {
        autoBind(this);
        this.app = express();
        this.server = null;
        this.configServer();
        this.configDatabase();
        this.setConfig();
        this.setRoutes();
    }
    configServer() {
        const port = config.server.PORT;
        this.server = http.createServer(this.app);
        this.server.listen(port, () => {
            console.log(chalk.bgGreen.black(`Server is running on port ${port}`));
        });
        
    }
    async configDatabase() {
        mongoose.connect(config.db.CONNECTION_STRING, config.db.OPTIONS)
            .then(() => console.log(chalk.bgGreen.black('Connected to mongodb')))
            .catch(err => console.log(chalk.bgRed.black('Could not connect to mongodb\n', err)));
    }
    setConfig() {

        //========================settings========================
        this.app.set('view engine', config.view.ENGINE);
        this.app.set('views', config.view.VIEW_DIR);
        this.app.set('layout', config.view.LAYOUT.USER_MASTER);
        this.app.set('layout extractScripts', config.view.LAYOUT.LAYOUT_EXTRACT_SCRIPTS);
        this.app.set('layout extractStyles', config.view.LAYOUT.LAYOUT_EXTRACT_STYLES);
        //=======================middlewares=======================
        this.app.use(express.static(config.Static.PUBLIC_DIR));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cookieParse(config.cookie.SECRET));
        this.app.use(session({
            secret: config.session.SECRET,
            saveUninitialized: true,
            resave: true,
            cookie: {
                secure: false
            },
            store: connectMongo.create({
                mongoUrl: config.db.CONNECTION_STRING,
            })
        }));
        this.app.use(ExpressEjsLayouts);
        this.app.use(flash());
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // this.app.use(methodOverride(function (req, res) {
        //     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        //         // look in urlencoded POST bodies and delete it
        //         var method = req.body._method
        //         delete req.body._method
        //         return method
        //     }
        // }))
        this.app.use(methodOverride('_method'));
        this.app.use((req, res, next) => {
            res.locals.errors = req.flash('errors');
            res.locals.success = req.flash('success');
            res.locals.server = this.server;
            res.locals.auth = {
                user: req.user,
                check: req.isAuthenticated()
            }
            res.locals.convert = convert;
            res.locals.moment = moment;
            next();
        });
    }
    setRoutes() {
        this.app.use(routes);
    }
}
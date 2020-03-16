/**
 * Module dependencies.
 */
import * as express from 'express';
//import Logs from './shared/logging/logs.model';
//import * as Http from 'http';
//import * as Path from 'path';
import * as CookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as compression from 'compression';  // compresses requests
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
//import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
//import * as mongo from 'connect-mongo';
import * as ejs from 'ejs';
//import * as flash from 'express-flash';
import * as path from 'path';
import * as mongoose from 'mongoose';
//import * as passport from 'passport';

/**
 * Load environment variables from .env file, where API keys and passwords
 * are configured.
 */
dotenv.config({ path: '.env.local' });

// Create a log directory if it doesn't exist.
//FileManagement.retrieveDirectoryList(Path.normalize(Path.join(__dirname, '../logs')));

/**
 * Controllers (route handlers).
 */
import RouteController from './config/routes';

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;
mongoose.connect(
  `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`,
  {
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
    useNewUrlParser: true
  }
);

mongoose.connection.on('error', (error: Error) => {

  // Log the error message.
  //Logs.message('error', `MongoDB connection error. Make sure MongoDB is running. | server`, error);
  console.log(`MongoDB connection error. Make sure MongoDB is running. | server`, error);
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 9000);
app.set('views', path.join(__dirname, '../views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

 //Set the cors acceptance headers.
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'http://localhost:9003'],
  optionsSuccessStatus: 200
}));

app.use(compression());
app.use(logger('dev'));
app.use(CookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
const routes = new RouteController();

// Use the routes registered with the Route controller.
app.use(routes.router);

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  // Log the app information message.
  //Logs.message('info', `App is running at http://localhost:${ app.get('port') } in ${ app.get('env') } | server`);
  console.log(`App is running at http://localhost:${ app.get('port') } in ${ app.get('env') } | server`);
});

module.exports = app;

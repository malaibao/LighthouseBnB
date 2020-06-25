// const database = require('./database'); // the old database.js
const apiRoutes = require('./routes/apiRoutes');
const userRoutes = require('./routes/userRoutes');

const path = require('path');

const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();

// db config
const pool = require('./dbConnect');
const usersHelper = require('./db/usersHelper')(pool);
const reservationsPropertiesHelper = require('./db/reservationsPropertiesHelper.js')(
  pool
);

app.use(
  cookieSession({
    name: 'session',
    keys: ['key1'],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// /api/endpoints
const apiRouter = express.Router();
apiRoutes(apiRouter, reservationsPropertiesHelper);
app.use('/api', apiRouter);

// /user/endpoints
const userRouter = express.Router();
userRoutes(userRouter, usersHelper);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/test', (req, res) => {
  res.send('🤗');
});

const port = process.env.PORT || 3000;
app.listen(port, (err) => console.log(err || `listening on port ${port} 😎`));

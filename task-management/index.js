const express = require('express');
const app = express();
require('dotenv').config();
const database = require('./config/database');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = process.env.PORT;
database.connect();
const routesApiv1 = require('./api/v1/routes/index.route');

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

routesApiv1(app);


app.listen(port, () => {
    console.log("App listening on port:", port);
})
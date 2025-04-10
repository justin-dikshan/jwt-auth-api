require('./config')
require('./config/db.config');
const express = require('express');
const authRouter = require("./routes/auth.router");
const { globalErrorHandler } = require("./utils/error");
const cookieParser = require('cookie-parser');

const port =  process.env.AUTHPORT || 4000

const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.get('/', (req, res, next) => {
    res.send('Auth API has started successfully.')
})
app.use('/auth', authRouter);
app.use(globalErrorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
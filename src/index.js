require('./config')
require('./config/db.config');
const express = require('express')
const {globalErrorHandler} = require("./utils/error");
const {jwtMiddleware} = require("./middleware/jwtMiddleware");

const port = process.env.PORT || 5001

const app = express();
app.use(express.json());
app.use(jwtMiddleware)

// This is a public route
app.get('/', (req, res) => res.send('API has started successfully.`'))

// This is a private route
app.get('/posts', (req, res, next) => res.send('You can access this private Route'))

// This is a the global error handler
app.use(globalErrorHandler)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
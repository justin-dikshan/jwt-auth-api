const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB)
    .then(() => console.log("connected to DB successfully"))
    .catch((e) => console.log(e.message))
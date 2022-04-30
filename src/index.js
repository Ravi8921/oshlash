const express = require('express');
const bodyParser = require('body-parser');

 const route = require('./routes/route')
 const mongoose = require('mongoose');

 const app = express();

 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: true }))


 app.use('/',route)

 mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/Ravikumar_?authSource=admin&replicaSet=atlas-wwe75z-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true", { useNewUrlParser: true })
 .then(() => console.log('mongodb running and connected'))
 .catch(err => console.log(err))



app.listen(process.env.PORT || 3001, function () {
 console.log('Express app running on port ' + (process.env.PORT || 3001))
});


 
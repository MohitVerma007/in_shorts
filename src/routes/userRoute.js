const express = require("express");
const user_route = express();

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.use(express.static('public'));

const userController = require("../controllers/userController");
user_route.post('/',userController.sendMail);
user_route.post('/create',userController.createMessage);
user_route.get('/image',userController.imageApi);
user_route.get('/message', userController.getMessages)


module.exports = user_route;
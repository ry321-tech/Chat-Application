const express = require('express');
const router = new express.Router();
const routeHandler = require('../controllers/route-handler');

  router.post('/register', routeHandler.registerRouteHandler);

  router.post('/login', routeHandler.loginRouteHandler);

  router.post('/userSessionCheck', routeHandler.userSessionCheckRouteHandler);

  router.post('/getMessages', routeHandler.getMessagesRouteHandler);

  router.get('*', routeHandler.routeNotFoundHandler);

module.exports = router;


const express = require('express');
const router = express.Router()

const routerEvt = require('./routerEvt')

router.get('/login', routerEvt.GetLogin)

router.post('/login', routerEvt.login)


module.exports = router;
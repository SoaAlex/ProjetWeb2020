
const db = require('../lib/db')
const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('../utils/jwt.utils')
const cookieParser = require('cookie-parser')

app.use(require('body-parser').json())
app.use(cookieParser())

//Cookies middlewear
app.use(cors({ origin: true, credentials: true }));


app.get('/', (req, res) => {
  res.send([
    '<h1>ECE DevOps Chat</h1>'
  ].join(''))
})

// Channels
app.get('/channels', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const channels = await db.channels.list(jwt.verifyToken(req.headers.authorization).username)
    res.json(channels)
  }
  else{
    res.sendStatus(401)
  }
})

app.post('/channels', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const channel = await db.channels.create(req.body)
    res.status(201).json(channel)
  }
  else{
    res.sendStatus(401)
  }
})

app.get('/channels/:id', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const channel = await db.channels.get(req.params.id)
    res.json(channel)
  }
  else{
    res.sendStatus(401)
  }
})

app.put('/channels/:id', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const channel = await db.channels.update(req.params.id, req.body)
    res.status(200).json(channel)
  }
  else{
    res.sendStatus(401)
  }
})

app.delete('/channels/:id', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const channel = await db.channels.update(req.params.id, req.body)
    res.status(200).json(channel)
  }
  else{
    res.sendStatus(401)
  }
})

// Messages

app.get('/channels/:id/messages', async (req, res) => {
  const messages = await db.messages.list(req.params.id)
  res.json(messages)
})

app.post('/channels/:id/messages', async (req, res) => {
  const message = await db.messages.create(req.params.id, req.body)
  res.status(201).json(message)
})

app.put('/channels/:idChannel/messages/:idMessage', async (req, res) => { //kebab case not applicable here due to - not accepted in req.params.id-channel
  if(jwt.verifyToken(req.headers.authorization) !== null){
    if(await db.messages.put(req.params.idChannel, req.params.idMessage, req.body) == 1){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  }
  else{
    res.json(401)
  }
})

app.get('/channels/:idChannel/message/:idMessage', async (req, res) => { //kebab case not applicable here due to - not accepted in req.params.id-channel
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const msg = await db.messages.get(req.params.idChannel, req.params.idMessage)
    if(msg != 0){
      res.status(200).json(msg)
    }
    else{
      res.sendStatus(500)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.delete('/channels/:idChannel/messages/:idMessage', async (req, res) => { //kebab case not applicable here due to - not accepted in req.params.id-channel
  if(jwt.verifyToken(req.headers.authorization) !== null){
    if(await db.messages.delete(req.params.idChannel, req.params.idMessage) == 1){
      res.sendStatus(200)
    }
    else{
      res.sendStatus(500)
    }
  }
  else{
    res.sendStatus(401)
  }
})

// Users

app.get('/users', async (req, res) => {
  const users = await db.users.list()
  res.json(users)
})

app.post('/users/register', async (req, res) => {
    status = await db.users.register(req.body)
    if(status.status == 409){
      res.status(409).json({'error': 'Duplicate user'}) //Duplicate user
    }
    else{
      res.sendStatus(201)
    }
})

app.post('/users/login', async (req, res) => {
    user = await db.users.login(req.body)
    if(user.status == 404){
      res.status(404).json({'error': 'User not found'}) //User not found
    }else if(user.status == 401){
      res.status(401).json({'error': 'Invalid password'}) //Invalid password
    }
    else{
      //Send jwt token to browser and store it in cookies
      res.cookie('authorization', user.token, { httpOnly: false });
      res.send()
    }
})

app.get('/users/:id', async (req, res) => {
  try{
    const user = await db.users.get(req.params.id)
    res.json(user)
  }catch(err){
    return res.sendStatus(404)
  }
})

app.put('/users/:id', async (req, res) => {
  const user = await db.users.update(req.body)
  res.json(user)
})

app.post('/admin/clear', async (req, res) =>{
  await db.admin.clear()
  res.sendStatus(200)
})

app.post('/jwt-decode', async (req, res) =>{
  const decodedToken = jwt.verifyToken(req.headers.authorization)
  res.json(decodedToken)
})

module.exports = app

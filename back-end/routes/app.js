
const db = require('../lib/db')
const express = require('express')
const cors = require('cors')
const app = express()
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
  const channels = await db.channels.list()
  res.json(channels)
})

app.post('/channels', async (req, res) => {
  const channel = await db.channels.create(req.body)
  res.status(201).json(channel)
})

app.get('/channels/:id', async (req, res) => {
  const channel = await db.channels.get(req.params.id)
  res.json(channel)
})

app.put('/channels/:id', async (req, res) => {
  const channel = await db.channels.update(req.body)
  res.json(channel)
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

module.exports = app


const db = require('./lib/db')
const express = require('express')
const cors = require('cors')
const app = express()
const jwt = require('./utils/jwt.utils')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');

app.use(require('body-parser').json())
app.use(cookieParser())
app.use(fileUpload());

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
    try{
      const channels = await db.channels.list(jwt.verifyToken(req.headers.authorization).username)
      res.json(channels)
    }catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.post('/channels', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    try{
      const channel = await db.channels.create(req.body)
      res.status(201).json(channel)
    }catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.get('/channels/:id', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    try{
      const channel = await db.channels.get(req.params.id)
      res.json(channel)
    }catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.put('/channels/:id', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    try{
      const channel = await db.channels.update(req.params.id, req.body)
      res.status(200).json(channel)
    }catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

/* UNUSED
app.delete('/channels/:id', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    const channel = await db.channels.update(req.params.id, req.body)
    res.status(200).json(channel)
  }
  else{
    res.sendStatus(401)
  }
})*/ 

// Messages

app.get('/channels/:id/messages', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    try{
      const messages = await db.messages.list(req.params.id)
      res.status(200).json(messages)
    }catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.post('/channels/:id/messages', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    try{
      const message = await db.messages.create(req.params.id, req.body)
      res.status(201).json(message)
    }catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.put('/channels/:idChannel/messages/:idMessage', async (req, res) => { //kebab case not applicable here due to - not accepted in req.params.id-channel
  if(jwt.verifyToken(req.headers.authorization) !== null){
    try{
      await db.messages.put(req.params.idChannel, req.params.idMessage, req.body)
      res.sendStatus(200)
    }
    catch(err){
      res.status(500).json(err)
    }
  }
  else{
    res.json(401)
  }
})

app.get('/channels/:idChannel/message/:idMessage', async (req, res) => { //kebab case not applicable here due to - not accepted in req.params.id-channel
  if(jwt.verifyToken(req.headers.authorization) !== null){
    let msg
    try{
      msg = await db.messages.get(req.params.idChannel, req.params.idMessage)
      res.status(200).json(msg)
    }
    catch(err){
      res.status(404).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.delete('/channels/:idChannel/messages/:idMessage', async (req, res) => { //kebab case not applicable here due to - not accepted in req.params.id-channel
  if(jwt.verifyToken(req.headers.authorization) !== null){
  try{
    await db.messages.delete(req.params.idChannel, req.params.idMessage)
    res.sendStatus(200)
  }
    catch(err){
      res.status(404).json(err)
    }
  }
  else{
    res.sendStatus(401)
  }
})

// Users

app.get('/users', async (req, res) => {
  try{
    const users = await db.users.list()
    res.json(users)
  }catch(err){
    res.status(500).json(err)
  }
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

app.put('/users', async (req, res) => {
  if(jwt.verifyToken(req.headers.authorization) !== null){
    status = await db.users.update(req.body)
    if(status.status){
      res.sendStatus(500)
    }
    else{
      res.sendStatus(201)
    }
  }
  else{
    res.sendStatus(401)
  }
})

app.get('/users/:id/avatar', async (req, res) => {
    avatar = await db.users.getAvatar(req.params.id)
    if(avatar !== null){
      res.status(200).json(avatar)
    }
    else{
      res.sendStatus(500)
    }
})

//Utils
app.post('/admin/clear', async (req, res) =>{
  await db.admin.clear()
  res.sendStatus(200)
})

app.post('/upload-avatar', async (req, res) =>{
  if(req.files === undefined){
    res.status(400).json("Missing file")
  }else{
    const file = req.files.file
    //NB I got into trouble trying to store using absolute path.
    //I was only able to get it work by storing data into /routes
    file.mv(`${__dirname}/uploads/${file.name}`, err =>{
      if(err){
        res.sendStatus(500)
      }
    })
    res.sendStatus(200)
  }
})

app.get('/avatar/:file', async (req, res) =>{
  if(req.params.file === undefined){
    res.status(400).json("Missing file name")
  }else{
    res.sendFile(`${__dirname}/uploads/${req.params.file}`);
  }
})

app.post('/jwt-decode', async (req, res) =>{
  const decodedToken = jwt.verifyToken(req.headers.authorization)
  res.json(decodedToken)
})

module.exports = app

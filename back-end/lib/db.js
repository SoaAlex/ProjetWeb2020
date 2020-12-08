
const {v4: uuid} = require('uuid')
const {clone, merge} = require('mixme')
const microtime = require('microtime')
const level = require('level')
const db = level(__dirname + '/../db')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt.utils')

module.exports = {
  channels: {
    create: async (channel) => {
      if(!channel.name) throw Error('Invalid channel')
      const id = uuid()
      await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(channel, {id: id})
    },
    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`channels:${id}`)
      const channel = JSON.parse(data)
      return merge(channel, {id: id})
    },
    list: async (username) => {
      return new Promise( (resolve, reject) => {
        let userFound = false;
        const channels = []
        db.createReadStream({
          gt: "channels:",
          lte: "channels" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          channel = JSON.parse(value)
          channel.id = key.split(':')[1]
          //Check if user belongs to channel. If yes, add this channel to list
          channel.users.forEach(user => {
            if(user === username){
              userFound = true
            }
          })
          if(userFound){
            channels.push(channel)
          }
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(channels)
        })
      })
    },
    update: (id, channel) => {
      updatedChannel = await db.put(`channels:${id}`, JSON.stringify(channel))
      return merge(updatedChannel, {id: id})
    },
    delete: (id, channel) => {
      const original = store.channels[id]
      if(!original) throw Error('Unregistered channel id')
      delete store.channels[id]
    }
  },
  messages: {
    create: async (channelId, message) => {
      if(!channelId) throw Error('Invalid channel')
      if(!message.author) throw Error('Invalid message')
      if(!message.content) throw Error('Invalid message')
      creation = microtime.now()
      await db.put(`messages:${channelId}:${creation}`, JSON.stringify({
        author: message.author,
        content: message.content,
        id: uuid()
      }))
      return merge(message, {channelId: channelId, creation: creation})
    },
    list: async (channelId) => {
      return new Promise( (resolve, reject) => {
        const messages = []
        db.createReadStream({
          gt: `messages:${channelId}:`,
          lte: `messages:${channelId}` + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          message = JSON.parse(value)
          const [, channelId, creation] = key.split(':')
          message.channelId = channelId
          message.creation = creation
          messages.push(message)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(messages)
        })
      })
    },
  },
  users: {
    register: async (user) => {
      //Verify user doesn't already exists
      let userNotFound = false;
      try{
        await db.get(`users:${user.username}`);
      }catch(err){//If not found
        userNotFound = true
      }

      if(userNotFound){
        //Hash passoword
        const hash = await bcrypt.hash(user.password, 5)
        user.password = hash

        //Insert in DB
        await db.put(`users:${user.username}`, JSON.stringify(user))
        return user
      }
      else{
        return {status: 409} //User already exists
      }
    },
    login: async (user) => {
      let userFound = null
      try{
        userFound = await db.get(`users:${user.username}`)
        userFound = JSON.parse(userFound)
      }catch(err){
        return {status: 404} //Invalid username
      }
      if(userFound){
        //Check if password matches hash
        const match = await bcrypt.compare(user.password, userFound.password);
        if(match){
          return {
            username: userFound.username, 
            status: 200,
            token: jwt.generateUserToken(userFound),
            //refreshToken: jwt.generateUserRefreshToken(userFound)
          }
        }
        else{
          return {status: 401} //Invalid password
        }
      }
    },
    get: async (id) => {
      if(!id) throw Error('Invalid id')
      const data = await db.get(`users:${id}`)
      const user = JSON.parse(data)
      return merge(user, {id: id})
    },
    list: async () => {
      return new Promise( (resolve, reject) => {
        const users = []
        db.createReadStream({
          gt: "users:",
          lte: "users" + String.fromCharCode(":".charCodeAt(0) + 1),
        }).on( 'data', ({key, value}) => {
          user = JSON.parse(value)
          user.id = key.split(':')[1]
          users.push(user)
        }).on( 'error', (err) => {
          reject(err)
        }).on( 'end', () => {
          resolve(users)
        })
      })
    },
    update: (id, user) => {
      const original = store.users[id]
      if(!original) throw Error('Unregistered user id')
      store.users[id] = merge(original, user)
    },
    delete: (id, user) => {
      const original = store.users[id]
      if(!original) throw Error('Unregistered user id')
      delete store.users[id]
    }
  },
  admin: {
    clear: async () => {
      await db.clear()
    }
  }
}

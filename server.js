const http = require('http')
const express = require('express')
const app = express()
app.locals.title = 'Crowdsource'
app.set('view engine', 'ejs')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const generateID = require('./lib/generate-id')
const demoPollData = require('./lib/demo-poll-data')
const moment = require('./public/lib/moment.min.js')

var port = process.env.PORT || 3000

if (!module.parent) {
  var server_instance = http.createServer(app)
                            .listen(port, function(){
                              console.log('Listening on port ' + port + '.')
  })
}

const server = socketIO(server_instance)
//////////////////////

app.locals.polls = {}
app.locals.admins = {}

if (!module.parent) {
  app.locals.polls = demoPollData('polls')
  app.locals.admins = demoPollData('admins')
}

server.on('connection', function(socket){
  console.log('A user has connected.', server.engine.clientsCount)
  var pollID
  var poll
  var newClientID = generateID()
  var clientID
  socket.emit('handshake', newClientID)

  socket.on('message', function(channel, message){

    if (channel === 'confirmIdentity'){
      if (message.pageType === 'poll') {pollID = message.pageID}
      else if (message.pageType === 'admin') {pollID = app.locals.admins[message.pageID]}
      poll = app.locals.polls[pollID]
      clientID = message.clientID

      socket.emit('loadPageData', {poll: poll, pollID: pollID})

      if (knownVote(pollID, clientID)) {
        var vote = poll.votes[clientID]
        socket.emit('confirmVote', poll.responses[vote])
      }
      else {socket.emit('noVote')}
    }

    else if (channel === 'voteCast') {
      poll.votes[clientID] = message
      server.sockets.emit('updateVotes', {poll: poll, pollID: pollID})

      var vote = poll.votes[clientID]
      socket.emit('confirmVote', poll.responses[vote])
    }

    else if (channel === 'saveExpiration') {
      poll.expiration = message
      server.sockets.emit('newExpiration', {pollExpiration: poll.expiration, pollID: pollID})
    }

    else if (channel === 'saveNewComment') {
      var comment = {time: moment(),
                     name: message.name,
                     comment: message.comment}

      poll.comments.push(comment)
      server.sockets.emit('newComment', {comment: comment, pollID: pollID})
    }

  })

  socket.on('disconnect', function(){
    console.log('A user has disconnected.', server.engine.clientsCount)
  })

  function knownVote(pollID, clientID){
    return (newClientID !== clientID && poll && poll.votes && poll.votes[clientID])
  }
})

///// ROUTES /////

app.use(express.static('public'))

app.get('/', function (request, response){
  response.render('index')
})

app.post('/newpoll', function(request, response){
  var adminID = generateID()
  var pollID = generateID()
  app.locals.admins[adminID] = pollID

  app.locals.polls[pollID] = pollWithoutEmptyResponses(request.body)
  app.locals.polls[pollID].votes = {}
  app.locals.polls[pollID].comments = []

  response.redirect('/admin/' + adminID)
})

app.get('/admin/:id', function(request, response){
  var adminID = request.params.id
  var pollID = app.locals.admins[adminID]
  if (app.locals.polls[pollID]){response.render('poll', {poll: app.locals.polls[pollID],
                                                  publicPath: accessPath('poll', pollID),
                                                  adminPath: accessPath('admin', adminID),
                                                  admin: true})}
  else {response.render('404')}
})

app.get('/poll/:id', function(request, response){
  var id = request.params.id
  if (app.locals.polls[id]){response.render('poll', {poll: app.locals.polls[id],
                                          admin: false})}
  else {response.render('404')}
})

///// ROUTES /////

function pollWithoutEmptyResponses(poll){
  for (var response in poll.responses){
    if (!poll.responses[response]){delete poll.responses[response]}
  }
  return poll
}

function accessPath(base, id){
  return '/' + base + '/' + id
}

module.exports = app
// pry = require('pryjs'); eval(pry.it)

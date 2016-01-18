const http = require('http')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
const socketIO = require('socket.io')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
const generateID = require('./lib/generate-id')
const moment = require('./public/lib/moment.min.js')

var port = process.env.PORT || 3000
var server_instance = http.createServer(app)
                          .listen(port, function(){
                            console.log('Listening on port ' + port + '.')
                            })
const server = socketIO(server_instance)
//////////////////////

var polls = {}
var admins = {}
var votes = {}
storeDemoPolls()

server.on('connection', function(socket){
  var pollID
  var poll
  console.log('A user has connected.', server.engine.clientsCount)
  var newClientID = generateID()
  var clientID
  socket.emit('handshake', newClientID)

  // server.sockets.emit('usersConnected', server.engine.clientsCount)

  socket.on('message', function(channel, message){

    if (channel === 'confirmIdentity'){
      if (message.pageType === 'poll') {pollID = message.pageID}
      else if (message.pageType === 'admin') {pollID = admins[message.pageID]}
      poll = polls[pollID]
      clientID = message.clientID

      socket.emit('loadExistingData', {poll: poll, pollID: pollID})

      if (knownVote(pollID, clientID)) {
        var vote = poll.votes[clientID]
        socket.emit('confirmVote', poll.responses[vote])
      }
      else {socket.emit('noVote')}
    }

    else if (channel === 'voteCast') {
      poll.votes[clientID] = message
      server.sockets.emit('loadExistingData', {poll: poll, pollID: pollID})

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
      server.sockets.emit('displayNewComment', {comment: comment, pollID: pollID})
    }

  })

  socket.on('disconnect', function(){
    console.log('A user has disconnected.', server.engine.clientsCount)
  })

  function knownVote(pollID, clientID){
    return (newClientID !== clientID && polls[pollID].votes && polls[pollID].votes[clientID])
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
  admins[adminID] = pollID

  polls[pollID] = pollWithoutEmptyResponses(request.body)
  polls[pollID].votes = {}
  polls[pollID].comments = []
  // pry = require('pryjs'); eval(pry.it)

  response.redirect('/admin/' + adminID)
})

app.get('/admin/:id', function(request, response){
  var adminID = request.params.id
  var pollID = admins[adminID]
  if (polls[pollID]){response.render('poll', {poll: polls[pollID],
                                                  publicPath: accessPath('poll', pollID),
                                                  adminPath: accessPath('admin', adminID),
                                                  admin: true})}
  else {response.render('404')}
})

app.get('/poll/:id', function(request, response){
  var id = request.params.id
  if (polls[id]){response.render('poll', {poll: polls[id],
                                          admin: false})}
  else {response.render('404')}
})

///// ROUTES /////

function storeDemoPolls(){
  polls['publicdemo'] =
               {question: 'Who put the bop in the bop shabop shabop?',
                responses: {a: "Bret",
                            b: "Matt",
                            c: "That guy in the back of the club",
                            d: "Yogi Bear"},
                votes: {},
                comments: [{time: 'Mon Jan 17 2016 11:31:03 GMT-0700 (MST)',
                                   name: 'Clarence',
                                   comment: "Was't it Zach?"},
                           {time: 'Mon Jan 18 2016 15:30:03 GMT-0700 (MST)',
                                   name: 'Thomas',
                                   comment: "I always thought it was Queen Latifah."}
                          ]
               }

  polls['privatedemo'] =
              {question: 'What is your greatest fear?',
               responses: {a: "Clowns",
                           b: "Jeff's hair",
                           c: "That guy in the back of the club",
                           d: "Black holes"},
               private: 'on',
               votes: {},
               comments: [{time: 'Mon Jan 18 2016 11:31:03 GMT-0700 (MST)',
                                  name: 'Clarence',
                                  comment: "I'm scared of everything!"},
                          {time: 'Mon Jan 18 2016 11:31:03 GMT-0700 (MST)',
                                  name: 'Clarence',
                                  comment: "I'm scared of everything!"}
                         ]
              }

  admins = {publicdemo: 'publicdemo',
            privatedemo: 'privatedemo'}
}

function pollWithoutEmptyResponses(poll){
  for (var response in poll.responses){
    if (!poll.responses[response]){delete poll.responses[response]}
  }

  return poll
}

function accessPath(base, id){
  return '/' + base + '/' + id
}

module.exports = server
// pry = require('pryjs'); eval(pry.it)

const http = require('http')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
const socketIO = require('socket.io')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const generateID = require('./lib/generate-id')

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
  console.log('A user has connected.', server.engine.clientsCount)
  var newClientID = generateID()
  var clientID
  socket.emit('handshake', newClientID)

  // server.sockets.emit('usersConnected', server.engine.clientsCount)

  socket.on('message', function(channel, message){

    if (channel === 'confirmIdentity'){
      pollID = message.pollID
      clientID = message.clientID

      console.log("knownVote: ", knownVote(pollID, clientID))
      if (knownVote(pollID, clientID)) {
        var vote = votes[pollID][clientID]
        socket.emit('confirmVote', votes[pollID][clientID])
      }
      else {socket.emit('noVote')}

    } else if (channel === 'voteCast'){
      console.log('votes: ', votes)
      console.log('pollID: ', pollID)
      console.log('clientID: ', clientID)

      votes[pollID][clientID] = message
      console.log('voteCast.votes: ', votes)
      // server.sockets.emit('voteSummary', prettyVotes(votes))
      socket.emit('confirmVote', votes[pollID][clientID])
    }
  })

  // socket.on('disconnect', function(){
  //   console.log('A user has disconnected.', server.engine.clientsCount)
  //   server.sockets.emit('usersConnected', server.engine.clientsCount)
  // })
  function knownVote(pollID, clientID){
    console.log("polls --> ", polls)
    console.log("pollID: ", pollID)
    console.log("clientID: ", clientID)
    console.log("newClientID !== clientID --> ", newClientID !== clientID)
    console.log("votes[pollId] --> ", votes[pollID])
    console.log("votes[pollID][clientID] --> ", votes[pollID][clientID])
    return (newClientID !== clientID && votes[pollID] && votes[pollID][clientID])
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

  storePoll(pollID, request.body)

  votes[pollID] = {}
  console.log('Polls --> ', polls)
  console.log('Admins --> ', admins)
  console.log('Votes --> ', votes)

  response.render('poll', {poll: polls[pollID],
                            publicPath: accessPath('poll', pollID),
                            adminPath: accessPath('admin', adminID),
                            admin: true})
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
               { question: 'Who put the bop in the bop shabop shabop?',
                 responses: { "Bret": 0, "Matt": 0, "That guy in the back of the club": 0, "Yogi Bear": 0 }}

  polls['privatedemo'] =
              { question: 'What is your greatest fear?',
                responses: { "Clowns": 0, "Jeff's hair": 0, "That guy in the back of the club": 0, "Black holes": 0 },
                private: 'on' }
  admins = {publicdemo: 'publicdemo',
            privatedemo: 'privatedemo'}
  votes = {publicdemo: {},
            privatedemo: {}}
}

function storePoll(pollID, pollData){
  polls[pollID] = {question: pollData.question,
    private: !!pollData.private}
    for (var response in pollData.responses){
      polls[pollID].responses[response] = 0
    }
}


function accessPath(base, id){
  return '/' + base + '/' + id
}

module.exports = server
// pry = require('pryjs'); eval(pry.it)

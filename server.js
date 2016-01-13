const http = require('http')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
const socketIO = require('socket.io')

var port = process.env.PORT || 3000
var server_instance = http.createServer(app)
                  .listen(port, function(){
                    console.log('Listening on port ' + port + '.')
                  })
const server = socketIO(server_instance)
var votes = {}
// var votesCast


server.on('connection', function(socket){
  console.log('A user has connected.', server.engine.clientsCount)

  server.sockets.emit('usersConnected', server.engine.clientsCount)

  socket.emit('statusMessage', 'You have connected')
  socket.emit('newVote', prettyVotes(votes))


  socket.on('message', function(channel, message){
    if (channel === 'voteCast'){
      votes[socket.id] = message
      server.sockets.emit('newVote', prettyVotes(votes))
      socket.emit('confirmVote', message)
    }
  })

  socket.on('disconnect', function(){
    console.log('A user has disconnected.', server.engine.clientsCount)
    delete votes[socket.id]
    server.sockets.emit('newVote', prettyVotes(votes))
    server.sockets.emit('usersConnected', server.engine.clientsCount)
  })
})

function votesCast(votes){
  var voteCounts = {
    A: 0,
    B: 0,
    C: 0,
    D: 0
  }
  for (vote in votes){
    voteCounts[votes[vote]]++
  }
  return voteCounts
}

function prettyVotes(votes){
  var voteCounts = votesCast(votes)
  var htmls = ''
  for (var key in voteCounts){
    htmls += '<h2>' + key + ': ' + voteCounts[key] + '</h2>'
  }
  return "<h1>Current Tally<h1>" + htmls
}

///// ROUTES /////

app.use(express.static('public'))
app.get('/', function (request, response){
  response.render('index')
})

///// ROUTES /////

module.exports = server

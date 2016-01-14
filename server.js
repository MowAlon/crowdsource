const http = require('http')
const express = require('express')
const app = express()
app.set('view engine', 'ejs')
const socketIO = require('socket.io')
const generateID = require('./lib/generate-id')

var port = process.env.PORT || 3000
var server_instance = http.createServer(app)
                          .listen(port, function(){
                      console.log('Listening on port ' + port + '.')
                      })
const server = socketIO(server_instance)
//////////////////////

var poll = {}
// storeDemoPolls()

server.on('connection', function(socket){
  console.log('A user has connected.', server.engine.clientsCount)

  server.sockets.emit('usersConnected', server.engine.clientsCount)

  socket.on('message', function(channel, message){
    if (channel === 'newPoll'){
      var url = generateID()
      poll[url] = message
      console.log('Poll: ', poll)
    } else if (channel === 'confirmIdentity'){
      console.log('confirmIdentity.votes: ', votes)
      if (id !== message && votes[message]) {
        id = message
        socket.emit('confirmVote', votes[id])}
      else {socket.emit('noVote')}
    }
  })

  socket.on('disconnect', function(){
    console.log('A user has disconnected.', server.engine.clientsCount)
    server.sockets.emit('usersConnected', server.engine.clientsCount)
  })
})

///// ROUTES /////

app.use(express.static('public'))
app.get('/', function (request, response){
  response.render('index')
})
app.get('/poll/:id', function(request, response){
  var url = request.params.id
  if (poll[url]){response.render('poll', {poll: poll[url]})}
  else {response.render('404')}
})

///// ROUTES /////


// function storeDemoPolls(){
//
//   poll['publicdemo'] =
//                { question: 'Who put the bop in the bop shabop shabop?',
//                  responses: { a: 'Bret', b: 'Matt', c: 'That guy in the back of the club', d: 'Yogi Bear' },
//                  private: false }
//
//   poll['privatedemo'] =
//               { question: 'What is your greatest fear?',
//                 responses: { a: 'Clowns', b: "Jeff's hair", c: 'That guy in the back of the club', d: 'Black holes' },
//                 private: true }
//
// }

module.exports = server

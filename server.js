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
storeDemoPolls()

server.on('connection', function(socket){
  console.log('A user has connected.', server.engine.clientsCount)

  server.sockets.emit('usersConnected', server.engine.clientsCount)

  socket.on('message', function(channel, message){
    if (channel === 'newPoll'){
      var url = generateID()
      polls[url] = message
      console.log('Poll: ', polls)
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

app.post('/newpoll', function(request, response){
  var poll_id = generateID()
  var admin_id = generateID()

  admins[admin_id] = poll_id
  polls[poll_id] = request.body
  console.log('Polls --> ', polls)
  console.log('Admins --> ', admins)

  response.render('poll', {poll: polls[poll_id], admin: true})
})

app.get('/admin/:id', function(request, response){
  // pry = require('pryjs'); eval(pry.it)
  var id = request.params.id
  if (polls[admins[id]]){response.render('poll', {poll: polls[admins[id]], admin: true})}
  else {response.render('404')}
})

app.get('/poll/:id', function(request, response){
  var id = request.params.id
  if (polls[id]){response.render('poll', {poll: polls[id]})}
  else {response.render('404')}
})

///// ROUTES /////


function storeDemoPolls(){
  polls['publicdemo'] =
               { question: 'Who put the bop in the bop shabop shabop?',
                 responses: { a: 'Bret', b: 'Matt', c: 'That guy in the back of the club', d: 'Yogi Bear' }}

  polls['privatedemo'] =
              { question: 'What is your greatest fear?',
                responses: { a: 'Clowns', b: "Jeff's hair", c: 'That guy in the back of the club', d: 'Black holes' },
                private: 'on' }
}

module.exports = server
// pry = require('pryjs'); eval(pry.it)

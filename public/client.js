var client = io()
// var connectionCount = document.getElementById('connection-count')
// var statusMessage = document.getElementById('status-message')
// var submittedVotes = document.getElementById('submitted-votes')


var buttons = document.querySelectorAll('.responses .btn')

// client.on('usersConnected', function(count){
//   connectionCount.innerText = 'Connected Users: ' + count
// })

client.on('handshake', function(id){
  localStorage.clientID = localStorage.clientID || id
  client.send('confirmIdentity', {clientID: localStorage.clientID, pollID: pollID()})
})

// client.on('statusMessage', function(message){
//   statusMessage.innerText = message
// })
//
// client.on('voteSummary', function(votes){
//   console.log(votes)
//   submittedVotes.innerHTML = votes
// })

if (notAdmin()){
  var myVote = document.getElementById('my-vote')

  client.on('noVote', function(){
    myVote.innerHTML = "<h2>We're anxiously awaiting your response!</h2>"
  })
  client.on('confirmVote', function(vote){
    myVote.innerHTML = "<h4>Thanks for voting! You selected this option:</h4>" +
                        "<h2>" + vote + "</h2>"
  })

  for (var i=0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(){
      client.send('voteCast', this.innerText)
    })
  }
}

function notAdmin(){
  var path = window.location.pathname
  return !(path.indexOf('newpoll') >= 0 || path.indexOf('admin') >= 0)
}

function pollID(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-1]
}

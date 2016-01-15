var client = io()
// var connectionCount = document.getElementById('connection-count')
// var statusMessage = document.getElementById('status-message')
var voteResults = document.getElementById('vote-results')


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

client.on('voteSummary', function(votes){
  console.log(votes)
  voteResults.innerHTML = prettyVotes(votes)
})

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

function votesCast(votes){
  console.log("votes: ", votes)
  var voteCounts = {}

  for (var clientID in votes){
    var response = votes[clientID]
    voteCounts[response] = ++voteCounts[response] || 1
  }
  return voteCounts

  // for (var vote in votes){
  //   voteCounts[votes[vote]]++
  // }
}

function prettyVotes(votes){
  console.log("prettyVotes received 'votes' as --> ", votes)
  var voteCounts = votesCast(votes)
  var htmls = ''
  for (var key in voteCounts){
    htmls += '<h6>' + key + ': ' + voteCounts[key] + '</h6>'
  }
  return "<h2>Live Results<h2>" + htmls
}

var client = io()
// var connectionCount = document.getElementById('connection-count')
// var statusMessage = document.getElementById('status-message')

client.on('handshake', function(id){
  localStorage.clientID = localStorage.clientID || id
  client.send('confirmIdentity', {clientID: localStorage.clientID, pollID: pollID()})
})

client.on('voteSummary', function(poll){
  if (!poll.private){ visualizeResults(poll) }
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

  var buttons = document.querySelectorAll('.responses .btn')
  for (var i=0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(){
      client.send('voteCast', this.id)
    })
  }
}

///////////////////////////////////////////////////////

function notAdmin(){
  var path = window.location.pathname
  return !(path.indexOf('newpoll') >= 0 || path.indexOf('admin') >= 0)
}

function pollID(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-1]
}

function visualizeResults(poll){
  var voteCounts = votesCast(poll.votes)
  var totalVoteCount = totalVotes(voteCounts)
    for (vote in poll.responses){
      var voteCount = voteCounts[vote] || 0
      var votePercent = (voteCount / totalVoteCount * 100) || 0
      if (totalVoteCount > 0){
        renderResultPercentage(vote, votePercent)
        changeButtonWidth(vote, votePercent)
      }
  }
}

function votesCast(votes){
  var voteCounts = {}

  for (var clientID in votes){
    var response = votes[clientID]
    voteCounts[response] = ++voteCounts[response] || 1
  }
  return voteCounts
}

function totalVotes(voteCounts){
  var result = 0
  for (vote in voteCounts){
    result += voteCounts[vote]
  }
  return result
}

function renderResultPercentage(vote, votePercent){
  document.getElementById('result-' + vote).innerText = Math.round(votePercent) + '%'
}

function changeButtonWidth(vote, votePercent){
  var width = (votePercent)/2 + 50
  $('#' + vote).css('width', width + '%')
}

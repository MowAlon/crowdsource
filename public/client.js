var client = io()
var clientPollID

client.on('handshake', function(id){
  localStorage.clientID = localStorage.clientID || id
  client.send('confirmIdentity', {clientID: localStorage.clientID, pageID: pageID(), pageType: pageType()})
})

client.on('voteSummary', function(pollData){
  var poll = pollData.poll
  var pollID = pollData.pollID
  clientPollID = clientPollID || pollID

  if (pollID === clientPollID && !poll.private){ visualizeResults(poll) }
})

client.on('newExpiration', function(pollData){
  var pollExpiration = pollData.pollExpiration
  var pollID = pollData.pollID

  if (pollID === clientPollID) {
    displayExpirationMessage(pollExpiration)
    adjustButtons(pollExpiration)
  }
})

if (!admin){
  var myVote = document.getElementById('my-vote')

  client.on('noVote', function(){
    myVote.innerHTML = "<h2>We're anxiously awaiting your response!</h2>"
  })

  client.on('confirmVote', function(vote){
    myVote.innerHTML = "<h4>Thanks for voting! You selected this option:</h4>" +
                        "<h2>" + vote + "</h2>"
  })

  var responseButtons = document.querySelectorAll('.responses .btn')
  for (var i=0; i < responseButtons.length; i++){
    responseButtons[i].addEventListener('click', function(){
      client.send('voteCast', this.id)
    })
  }

} else {

  document.getElementById('close-poll').addEventListener('click', function(){
    var expiration = moment().format('L ' + 'h:mm A')
    document.getElementById('expiration').value = expiration
    client.send('saveExpiration', expiration)
  })
  document.getElementById('save-expiration').addEventListener('click', function(){
    var expiration = document.getElementById('expiration').value
    client.send('saveExpiration', expiration)
  })

}

///////////////////////////////////////////////////////

function pageID(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-1]
}

function pageType(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-2]
}

function visualizeResults(poll){
  var voteCounts = votesCast(poll.votes)
  var totalVoteCount = totalVotes(voteCounts)
    for (var vote in poll.responses){
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
  for (var vote in voteCounts){
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

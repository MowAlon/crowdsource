var client = io()
var clientPollID
var responseButtons = document.querySelectorAll('.responses button')
var commentsDiv = document.getElementById('comments')
adjustButtonListeners()

client.on('handshake', function(id){
  localStorage.clientID = localStorage.clientID || id
  client.send('confirmIdentity', {clientID: localStorage.clientID, pageID: pageID(), pageType: pageType()})
})

client.on('loadPageData', function(pollData){
  var poll = pollData.poll
  var pollID = pollData.pollID
  clientPollID = clientPollID || pollID

  if (relevantClient(pollID)){
    visualizeResults(poll)
    loadComments(poll.comments)
  }
})

client.on('updateVotes', function(pollData){
  var poll = pollData.poll
  var pollID = pollData.pollID
  if (relevantClient(pollID)){visualizeResults(poll)}
})

client.on('newComment', function(commentData){
  var comment = commentData.comment
  var pollID = commentData.pollID
  if (relevantClient(pollID)) {addComment(comment)}
})

client.on('newExpiration', function(pollData){
  var pollExpiration = pollData.pollExpiration
  var pollID = pollData.pollID

  if (relevantClient(pollID)) {
    displayExpirationMessage(pollExpiration)
    adjustButtons(pollExpiration)
    adjustButtonListeners()
  }
})

document.getElementById('comment-button').addEventListener('click', function(){
  var name = document.getElementById('comment-name').value
  var comment = document.getElementById('comment-text').value
  client.send('saveNewComment', {name: name, comment: comment})
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

function sendVoteCast(){
  client.send('voteCast', this.id)
}

function adjustButtonListeners() {
  if (responseButtons[0].className === 'dead-button') {
    for (var i=0; i < responseButtons.length; i++){
      responseButtons[i].removeEventListener('click', sendVoteCast)
    }
  } else {
    for (var i=0; i < responseButtons.length; i++){
      responseButtons[i].addEventListener('click', sendVoteCast)
    }
  }
}

function pageID(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-1]
}

function pageType(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-2]
}

function isAdminPage(){
  return pageType() === 'admin'
}

function relevantClient(pollID){
  return (pollID === clientPollID)
}

function visualizeResults(poll){
  if (!poll.private || isAdminPage() ){
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
    renderTotalVoteCount(totalVoteCount)
  }
}

function loadComments(comments){
  sortedComments = comments.sort(function(a,b){
                     if (a.time > b.time) {return 1}
                     if (a.time < b.time) {return -1}
                     return 0
                   })

  $(commentsDiv).empty()
  sortedComments.forEach(function(comment){
    addComment(comment)
  })
}

function addComment(comment){
  var commentHTML =
          "<div class='comment panel'>" +
            "<p class='comment-time text-right'>" + moment(comment.time).calendar() + "</p>" +
            "<h4 class='comment-name'>" + comment.name + " said:</h4>" +
            "<p class='comment-comment'>" + comment.comment + "</p>" +
          "</div>"
  $(commentsDiv).prepend(commentHTML)
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

function renderTotalVoteCount(totalVoteCount){
  var totalVotesDiv = document.getElementById('total-votes')
  totalVotesDiv.className = 'total-votes'
  totalVotesDiv.innerText = totalVoteCount + ' ' + pluralizeVote(totalVoteCount)
}

function pluralizeVote(count){
  if (count === 1) {return 'vote'}
  else {return 'votes'}
}

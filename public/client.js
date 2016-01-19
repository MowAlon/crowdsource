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

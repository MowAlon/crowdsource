var client = io()
var connectionCount = document.getElementById('connection-count')
var statusMessage = document.getElementById('status-message')
var submittedVotes = document.getElementById('submitted-votes')
var confirmVote = document.getElementById('confirm-vote')

var buttons = document.querySelectorAll('#choices button')

client.on('usersConnected', function(count){
  connectionCount.innerText = 'Connected Users: ' + count
})

client.on('statusMessage', function(message){
  statusMessage.innerText = message
})

client.on('newVote', function(votes){
  console.log(votes)
  submittedVotes.innerHTML = votes
})

client.on('confirmVote', function(vote){
  confirmVote.innerText = 'Thanks for voting! You selected ' + vote + '.'
})

for (var i=0; i < buttons.length; i++){
  buttons[i].addEventListener('click', function(){
    client.send('voteCast', this.innerText)
  })
}

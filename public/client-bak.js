var client = io()
var connectionCount = document.getElementById('connection-count')
var statusMessage = document.getElementById('status-message')
var submittedVotes = document.getElementById('submitted-votes')
var myVote = document.getElementById('my-vote')


var buttons = document.querySelectorAll('#choices button')

client.on('usersConnected', function(count){
  connectionCount.innerText = 'Connected Users: ' + count
})

client.on('handshake', function(id){
  document.cookie = document.cookie || id
  client.send('confirmIdentity', document.cookie)
})

client.on('statusMessage', function(message){
  statusMessage.innerText = message
})

client.on('voteSummary', function(votes){
  console.log(votes)
  submittedVotes.innerHTML = votes
})

client.on('noVote', function(){
  myVote.innerText = "You haven't voted yet!"
})
client.on('confirmVote', function(vote){
  myVote.innerText = 'Thanks for voting! You selected ' + vote + '.'
})

for (var i=0; i < buttons.length; i++){
  buttons[i].addEventListener('click', function(){
    client.send('voteCast', this.innerText)
  })
}

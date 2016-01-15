var client = io()
// var connectionCount = document.getElementById('connection-count')
// var statusMessage = document.getElementById('status-message')
// var submittedVotes = document.getElementById('submitted-votes')


var buttons = document.querySelectorAll('.responses .btn')

// client.on('usersConnected', function(count){
//   connectionCount.innerText = 'Connected Users: ' + count
// })

client.on('handshake', function(id){
  document.cookie = document.cookie || id
  client.send('confirmIdentity', document.cookie)
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
    myVote.innerText = "We're anxiously awaiting your response!"
  })
  client.on('confirmVote', function(vote){
    myVote.innerText = 'Thanks for voting! You selected ' + vote + '.'
  })

  for (var i=0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(){
      client.send('voteCast', this.id)
    })
  }
}

function notAdmin(){
  var path = window.location.pathname
  return !(path.indexOf('newpoll') >= 0 || path.indexOf('admin') >= 0)
}

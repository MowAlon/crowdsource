if (pollExpiration) {
  expiration = document.getElementById('expiration-message')
  expiration.innerText = expirationMessage()
}

function expirationMessage(){
  if (pollExpired()) {return 'Poll is closed'}
  else {return 'Poll closes ' + moment(pollExpiration).calendar()}
}

function pollExpired(){
  var now = moment(Date())
  var expiration = moment(pollExpiration)
  return (now >= expiration)
}

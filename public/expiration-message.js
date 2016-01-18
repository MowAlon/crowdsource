displayExpirationMessage(pollExpiration)

function displayExpirationMessage(expirationForDisplay){
  if (expirationForDisplay) {
    expiration = document.getElementById('expiration-message')
    expiration.innerText = expirationMessage(expirationForDisplay)
  } else {expiration.innerText = ''}
}

function expirationMessage(expirationForDisplay){
  if (pollExpired(expirationForDisplay)) {return 'Poll is closed.'}
  else {return 'Poll closes ' + moment(expirationForDisplay).calendar()}
}

function pollExpired(expirationForDisplay){
  var now = moment()
  var expiration = moment(expirationForDisplay)
  return (expiration <= now)
}

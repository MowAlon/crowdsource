displayExpirationMessage(pollExpiration)

function displayExpirationMessage(expirationForDisplay){
  var expirationDiv = document.getElementById('expiration-message')
  if (expirationForDisplay) {
    expirationDiv.innerText = expirationMessage(expirationForDisplay)
  } else {expirationDiv.innerText = ''}
}

function expirationMessage(expirationForDisplay){
  if (pollExpired(expirationForDisplay)) {return 'Poll is closed.'}
  else {return 'Poll closes ' + moment(expirationForDisplay).calendar()}
}

function pollExpired(expiration){
  var now = moment()
  expiration = moment(expiration)
  return (expiration <= now)
}

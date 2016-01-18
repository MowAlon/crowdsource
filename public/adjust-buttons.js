adjustButtons(pollExpiration)

function adjustButtons(newPollExpiration){
  if (admin || pollExpired(newPollExpiration)) {killButtons()}
  else {activateButtons()}
}

/////////////////////////

// function pollExpired(){
//   var now = moment()
//   var expiration = moment(pollExpiration)
//   console.log('poll expired? ', expiration <= now)
//   return (expiration <= now)
// }

function killButtons() {
  $('.responses button').each(function(index, button){
    killButton(button)
  })
}
function killButton(button){
  $('.responses button').each(function(index, button){
    button.className = 'dead-button'
  })
}

function activateButtons(){
  var classes = {a: 'btn btn-danger',
                 b: 'btn btn-warning',
                 c: 'btn btn-success',
                 d: 'btn btn-primary'}

  $('.responses button').each(function(index, button){
    activateButton(classes, button)
  })
}
function activateButton(classes, button){
  button.className = classes[button.id]
}

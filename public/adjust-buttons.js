console.log('In adjust-buttons.js, pollExpiration is --> ', pollExpiration)
if (admin || pollExpired()) {killButtons()}
else {activateButtons()}

/////////////////////////

function pollExpired(){
  var now = moment(Date())
  var expiration = moment(pollExpiration)
  return (now >= expiration)
}

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

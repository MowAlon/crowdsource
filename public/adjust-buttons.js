if (admin) {killButtons()}
else {activateButtons()}

/////////////////////////

function killButtons() {
  $('.responses .btn').each(function(index, button){
    killButton(button)
  })
}
function killButton(button){
  $('.responses .btn').each(function(index, button){
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
  $(button).addClass(classes[button.id])
}

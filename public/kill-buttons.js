$(document).ready(function() {
  $('.responses .btn').each(function(index, button){
    killButton(button)
  })
})

function killButton(button){
  $('.responses .btn').each(function(index, button){
    button.className = 'admin-response'
  })
}

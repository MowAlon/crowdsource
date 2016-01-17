var classes = {a: 'btn btn-danger',
               b: 'btn btn-warning',
               c: 'btn btn-success',
               d: 'btn btn-primary'}

$('.responses button').each(function(index, button){
  $(button).addClass(classes[button.id])
})

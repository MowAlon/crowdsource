var classes = {a: 'btn-danger',
               b: 'btn-warning',
               c: 'btn-success',
               d: 'btn-primary'}

$('.responses .btn').each(function(index, button){
  $(button).addClass(classes[button.id])
})

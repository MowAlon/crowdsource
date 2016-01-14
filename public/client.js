var client = io()
sendPoll()


function sendPoll(){
  $('.submit-poll').on('click', function(e){

    e.preventDefault()

    var poll = {
      question: $('.create-poll .question').val(),
      responses: {
        a: $('#response-a').val(),
        b: $('#response-b').val(),
        c: $('#response-c').val(),
        d: $('#response-d').val()
      }
    }

    client.send('newPoll', poll)

  })
}

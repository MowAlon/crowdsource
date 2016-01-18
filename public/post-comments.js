$(document).ready(function() {

})

document.getElementById('comments')

sortedComments = poll.comments.sort(function(a,b){
                   if (a.time > b.time) {return 1}
                   if (a.time < b.time) {return -1}
                   return 0
                 })

sortedComments.forEach(function(comment){
  appendComment(comment)
})

function appendComment(comment){

}

  // <div class='comment'>
  //   <p class='comment-time'>poll.comments[key].time</p>
  //   <p class='comment-name'>poll.comments[key].name</p>
  //   <p class='comment-comment'>poll.comments[key].comment</p>
  // </div>

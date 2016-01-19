function pageID(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-1]
}

function pageType(){
  var pathBits = window.location.pathname.split('/')
  return pathBits[pathBits.length-2]
}

function isAdminPage(){
  return pageType() === 'admin'
}

function relevantClient(pollID){
  return (pollID === clientPollID)
}

function visualizeResults(poll){
  if (!poll.private || isAdminPage() ){
    var voteCounts = votesCast(poll.votes)
    var totalVoteCount = totalVotes(voteCounts)
    for (var vote in poll.responses){
      var voteCount = voteCounts[vote] || 0
      var votePercent = (voteCount / totalVoteCount * 100) || 0
      if (totalVoteCount > 0){
        renderResultPercentage(vote, votePercent)
        changeButtonWidth(vote, votePercent)
      }
    }
    renderTotalVoteCount(totalVoteCount)
  }
}

function loadComments(comments){
  sortedComments = comments.sort(function(a,b){
                     if (a.time > b.time) {return 1}
                     if (a.time < b.time) {return -1}
                     return 0
                   })

  $(commentsDiv).empty()
  sortedComments.forEach(function(comment){
    addComment(comment)
  })
}

function addComment(comment){
  var commentHTML =
          "<div class='comment panel'>" +
            "<p class='comment-time text-right'>" + moment(comment.time).calendar() + "</p>" +
            "<h4 class='comment-name'>" + comment.name + " said:</h4>" +
            "<p class='comment-comment'>" + comment.comment + "</p>" +
          "</div>"
  $(commentsDiv).prepend(commentHTML)
}

function votesCast(votes){
  var voteCounts = {}

  for (var clientID in votes){
    var response = votes[clientID]
    voteCounts[response] = ++voteCounts[response] || 1
  }
  return voteCounts
}

function totalVotes(voteCounts){
  var result = 0
  for (var vote in voteCounts){
    result += voteCounts[vote]
  }
  return result
}

function renderResultPercentage(vote, votePercent){
  document.getElementById('result-' + vote).innerText = Math.round(votePercent) + '%'
}

function changeButtonWidth(vote, votePercent){
  var width = (votePercent)/2 + 50
  $('#' + vote).css('width', width + '%')
}

function renderTotalVoteCount(totalVoteCount){
  var totalVotesDiv = document.getElementById('total-votes')
  totalVotesDiv.className = 'total-votes'
  totalVotesDiv.innerText = totalVoteCount + ' ' + pluralizeVote(totalVoteCount)
}

function pluralizeVote(count){
  if (count === 1) {return 'vote'}
  else {return 'votes'}
}

$(document).ready(function() {
  fillLink('public')
  fillLink('admin')
})

function fillLink(id){
  var element = document.getElementById(id)
  var url = completeURL(element.innerText)
  element.innerHTML = "<h4><a href='" + url + "'>" + url + "</a></h4>"
}

function completeURL(path){
  return window.location.origin + path
}

function addToCircle(fields) {
    fetch('/api/circles', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function removeFromCircle(fields) {
    fetch(`/api/circles/${fields.circlename}/members/${fields.username}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function deleteCircle(fields) {
    fetch(`api/circles/${fields.circlename}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function viewAllCircles(fields) {
    fetch('/api/circles', {method: 'GET'})
      .then(showResponse)
      .catch(showResponse);
  }
  
function viewCirclesByCirclename(fields) {
    fetch(`/api/circles?circlename=${fields.circlename}`, {method: 'GET'})
        .then(showResponse)
        .catch(showResponse);
}

function viewCirclesByMember(fields) {
    fetch(`/api/circles/members?username=${fields.username}`, {method: 'GET'})
        .then(showResponse)
        .catch(showResponse);
}
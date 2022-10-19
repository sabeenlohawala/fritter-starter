function addToCircle(fields) {
    fetch('/api/circles', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function removeFromCircle(fields) {
    fetch(`/api/circles/${fields.circlename}/${fields.username}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
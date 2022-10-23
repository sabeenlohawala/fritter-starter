function createMute(fields) {
    fetch('/api/mutes', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
}

function deleteMute(fields) {
    fetch(`/api/mutes/${fields.muteId}`, {method: 'DELETE',})
      .then(showResponse)
      .catch(showResponse);
}

function viewMyMutes(fields) {
    fetch('/api/mutes')
      .then(showResponse)
      .catch(showResponse);
  }
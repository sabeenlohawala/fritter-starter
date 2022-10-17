function followUser(fields) {
fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
    fetch(`/api/follows/following/${fields.username}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function removeFollower(fields) {
    fetch(`/api/follows/follower/${fields.username}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}
function viewMyFeed(fields) {
    fetch('/api/feeds')
      .then(showResponse)
      .catch(showResponse);
}
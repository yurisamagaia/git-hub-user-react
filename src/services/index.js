const apiUrl = 'https://api.github.com'

const oauth = '?access_token=b55e1df984b6d56c0aac358c3d9f548184cbd865'

export default {
  getUser (request, success, error) {

    return fetch(apiUrl + '/users/' + request + oauth)
      .then(response => response.json())
      .then(data => success(data))
      .catch(e => { if (typeof error === 'function') error(e) });

  },
  getUserRepos (request, success, error) {

    return fetch(apiUrl + '/users/' + request +'/repos')
      .then(response => response.json())
      .then(data => success(data))
      .catch(e => { if (typeof error === 'function') error(e) });

  }
}

function getUserRepos(user) {
    var apiURL = "https://api.github.com/users/" + user + "/repos/";
    
    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            console.log(data);
        })
    })
}

getUserRepos();
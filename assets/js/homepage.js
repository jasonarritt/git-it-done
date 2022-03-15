let userFormEl = document.querySelector('#user-form');
let nameInputEl = document.querySelector('#username');
let repoContainerEl = document.querySelector('#repos-container');
let repoSearchTerm = document.querySelector('#repo-search-term');

function getUserRepos(user) {
    let apiURL = "https://api.github.com/users/" + user + "/repos";
    
    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data, user);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    })
    .catch(function (error) {
        alert("Unable to Connect to GitHub");
    })
}

function formSubmitHandler(event) {
    event.preventDefault();

    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = '';
    } else {
        alert('Please enter a GitHub username');
    }
    console.log(event);
}

function displayRepos(repos, searchTerm) {
    repoContainerEl.textContent = '';
    repoSearchTerm.textContent = searchTerm;

    if (repos.length === 0) {
        repoContainerEl.textContent = "No Repositories Found.";
        return;
    }

    //Loop over repos
    for ( i = 0; i < repos.length; i++) {
        //Format repo name
        let repoName = repos[i].owner.login + '/' + repos[i].name;

        //Create a container for each repo
        let repoEl = document.createElement('a');
        repoEl.classList = 'list-item flex-row justify-space-between align-center';
        repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

        //Create a span element to hold repo name
        let titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        //Create a status element
        let statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        //Check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            // debugger
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";

            console.log(repos[i].open_issues_count);
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";

            console.log("Open issues count for this repo is 0");
        }

        //Append to container
        repoEl.appendChild(titleEl);

        //Append to container
        repoEl.appendChild(statusEl);



        //Append container to DOM
        repoContainerEl.appendChild(repoEl);
    }


    console.log(repos, searchTerm);
}

userFormEl.addEventListener('submit', formSubmitHandler);
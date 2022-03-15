

let issueContainerEl = document.querySelector('#issues-container');
let limitWarningsEl = document.querySelector('#limit-warning');
let repoNameEl = document.querySelector('#repo-name');

function getRepoName() {
    //Retrieve repo name from URL query string
    let queryString = document.location.search;
    let repoName = queryString.split('=')[1];

    if (repoName) {
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        document.location.replace('./index.html');
    }
}

function getRepoIssues(repo) {
    let apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiURL).then(function (response) {
        //Request was OK
        if (response.ok) {
            response.json().then(function (data) {
                displayIssues(data);

                //Check if API has paginated issues
                if (response.headers.get('link')) {
                    displayWarning(repo);
                }
            });
        } else {
            //If not successful redirect to home page and inform the user
            document.location.replace('./index.html');
            alert('There Was a Problem with Your Request. Returning to home page.');
        }
    });
}

function displayIssues(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = 'This Repo has 0 Open Issues.';
        return;
    };

    for (i = 0; i < issues.length; i++) {
        //Create a link element for each issue
        let issueEl = document.createElement('a');
        issueEl.classList = 'list-item flex-row justify-space-between align-center';
        issueEl.setAttribute('href', issues[i].html_url);
        issueEl.setAttribute('target', '_blank');

        //Create a span to hold issue title
        let titleEl = document.createElement('span');
        titleEl.textContent = issues[i].title;

        //Append to container
        issueEl.appendChild(titleEl);

        //Create a type element
        let typeEl = document.createElement('span');

        //Check if issue or pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else { 
            typeEl.textContent = "(Issue)";
        }

        //Append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
}

function displayWarning(repo) {
    //Add text to warning container
    limitWarningsEl.textContent = 'To see more than 30 issues, visit ';

    let linkEl = document.createElement('a');
    linkEl.textContent = 'See more issues on GitHub.com';
    linkEl.setAttribute('href', 'https://github.com/' + repo + '/issues');
    linkEl.setAttribute('target', '_blank');

    //Append to warning container
    limitWarningsEl.appendChild(linkEl);
}

getRepoName();
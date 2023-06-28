const APIURL = "https://api.github.com/users/";   // The Github users API

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

async function getUser(username) {    // The function to get user data
  try {
    const { data } = await axios(APIURL + username);    // Collects the JSON from the API call and converts to object
    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard("Profile with this username not Found");
    }
  }
}

async function getRepos(username) {   // The function to collect repos made by a user, sorted by created date
  try {
    const { data } = await axios(APIURL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
}

function createUserCard(user) {
  if (user.bio == null) user.bio = "Welcome to my Github Profile!";   // If the user has no bio, it enters a generic bio
  // Below it creates the html code to be inserted in between the original file to show the card
  const cardhtml = `
    <div class="card">
    <div>
      <a href="${user.html_url}" target="_blank">
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </a>
    </div>
    <div class="user-info">
      <h2>${user.name}</h2>     
      <p>${user.bio}</p>
      <ul>
        <li>${user.followers} <strong>Followers </strong></li>
        <li>${user.following} <strong>Following </strong></li>
        <li>${user.public_repos} <strong>Repos </strong></li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>
  `;
  main.innerHTML = cardhtml;    // Inserts the card inside main
}

function createErrorCard(msg) {
  // Creates error card
  const cardHTML = `
      <div class="card">
          <h1>${msg}</h1>
      </div>
  `;
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {  // Insert the repos under the class repos
  const reposEl = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

// Is an event listener for Enter key
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});

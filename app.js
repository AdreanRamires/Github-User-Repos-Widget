const submitHandler = (e) => {
  e.preventDefault();
  if (username.value == "") {
    clearInput();
    errorHandler("empty");
  } else {
    getRepositories();
  }
};

async function getRepositories() {
  const url = `https://api.github.com/users/${username.value.trim()}/repos`;
  const response = await fetch(url);

  if (response.ok) {
    errorMessage.textContent = "";
    const data = await response.json();
    clearInput();
    renderRepositories(data, response);
  } else {
    clearInput();
    errorHandler(response);
  }
}

const renderRepositories = (data) => {
  if (data.length > 0) {
    data.forEach((repository) => {
      const li = document.createElement("li");
      li.innerHTML = `
    <a href="${repository.html_url}">
      <article class="repository">
        <div class="repository-name-description">
          <p class="repository-name">${repository.name}</p>
          <p class="repository-description">${repository.description}</p>
        </div>
        <div class="repository-creation-date">${calculateDate(
          repository
        )} days ago</div>
      </article>
    </a>`;
      repositoriesList.appendChild(li);
    });
  } else {
    errorHandler(data);
  }
};

const calculateDate = (repository) => {
  const date = new Date();
  const [year, month, day] = repository.created_at.split("T")[0].split("-");
  const createdAt = new Date(`${month}/${day}/${year}`);
  const daysAgo = Math.round((date - createdAt.getTime()) / (1000 * 3600 * 24));
  return daysAgo;
};

const clearInput = () => {
  username.value = "";
  repositoriesList.innerHTML = "";
};

const errorHandler = (error) => {
  if (error.status == 404) {
    errorMessage.textContent = "Username not found";
  } else if (error.length == 0) {
    errorMessage.textContent = "User does not have any repositories";
  } else if (error == "empty") {
    errorMessage.textContent = "Please enter a username";
  }
};

const repositoriesList = document.querySelector(".repositories-list");
const username = document.querySelector("#username");
const searchBtn = document.querySelector(".search-btn");
const errorMessage = document.querySelector(".error");
searchBtn.addEventListener("click", submitHandler);

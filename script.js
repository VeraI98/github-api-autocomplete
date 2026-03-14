const input = document.getElementById("searchInput");
const autocomplete = document.getElementById("autocomplete");
const repoList = document.getElementById("repoList");


function debounce(fn, delay){

    let timer;

    return function(...args){
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}


async function fetchRepositories(query){

    const url = `https://api.github.com/search/repositories?q=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items.slice(0,5);
}


function showAutocomplete(repos){

    autocomplete.innerHTML = "";
    repos.forEach(repo => {

        const item = document.createElement("div");

        item.classList.add("autocomplete-item");
        item.textContent = repo.name;
        item.addEventListener("click", () => {

            addRepository(repo);
            input.value = "";
            autocomplete.innerHTML = "";
        });

        autocomplete.appendChild(item);
    });
}


function addRepository(repo){

    const repoItem = document.createElement("div");
    repoItem.classList.add("repo");

    repoItem.innerHTML = `
        Name: ${repo.name} <br>
        Owner: ${repo.owner.login} <br>
        Stars: ${repo.stargazers_count}
    `;

    const deleteBtn = document.createElement("div");

    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
        repoItem.remove();
    });

    repoItem.appendChild(deleteBtn);

    repoList.appendChild(repoItem);
}



const searchHandler = debounce(async function(){

    const query = input.value.trim();

    if(query === ""){
        autocomplete.innerHTML = "";
        return;
    }

    const repos = await fetchRepositories(query);
    showAutocomplete(repos);

}, 500);

input.addEventListener("input", searchHandler);

// ВСЁЁЁЁЁЁ
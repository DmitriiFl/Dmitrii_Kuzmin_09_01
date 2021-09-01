const url = 'https://my-json-server.typicode.com/moviedb-tech/movies/list';
const moviesTable = document.querySelector(".movies-table");
const list = document.querySelector(".list");
const modal = document.querySelector(".modal");
const modalSide = document.querySelector(".modal-side");
const modalMain = document.querySelector(".modal-main");
const modalCross = document.querySelector(".modal-cross");
const overlay = document.querySelector(".overlay");
const select = document.querySelector("#genre_select");
const filtersValues = ["all", "action", "crime", "usa", "comedy", "drama", "sci-fi", "adventure", "thriller", "sport", "biography"];


filtersValues.map(i => {
    const option = document.createElement("option");
    option.innerHTML = i;
    option.setAttribute("id", i);
    select.appendChild(option);
});
select.addEventListener("change", (e) => handleFilter(e.target.value));

modalCross.addEventListener("click", hideModal);

if (!localStorage.getItem('movies_gallery')) {
    fetch(url)
        .then(res => res.json())
        .then(res => {
            const data = res.map(i => ({...i, favorite: false, genres: i.genres.map(j => j.toLowerCase())}));
            localStorage.setItem('movies_gallery', JSON.stringify(data));
            showData(data);
            showFavoriteList(data);
        });
} else {
    const data = JSON.parse(localStorage.getItem('movies_gallery'));
    showData(data);
    showFavoriteList(data);
}

function showData(data) {
    moviesTable.innerHTML = "";
    data.map(movie => {
        createMovieItem(movie);
    });
}

function createDivWithClassAndInnerHtml(className, data) {
    const div = document.createElement("div");
    div.setAttribute("class", className);
    if (data) {
        div.innerHTML = data;
    }
    return div;
}

function createMovieItem(movie) {
    const div = createDivWithClassAndInnerHtml("movie-item");
    div.onclick = () => showModal(movie);

    const selected = document.createElement("img");
    selected.setAttribute('src', movie.selected ? "./assets/img/star_selected.png" : "./assets/img/star_unselected.png");
    selected.onclick = (e) => toggleSelected(e, movie.id);

    const img = createDivWithClassAndInnerHtml("image-container");
    img.style.backgroundImage = `url(${movie.img})`;

    const name = createDivWithClassAndInnerHtml("movie-item-name", movie.name);

    const year = createDivWithClassAndInnerHtml("movie-item-year", movie.year);

    div.innerHTML += img.outerHTML + name.outerHTML + year.outerHTML;
    div.appendChild(selected);
    moviesTable.appendChild(div);
}

function toggleSelected(e, id) {
    e.stopPropagation();
    const data = JSON.parse(localStorage.getItem("movies_gallery"));
    const updatedData = data.map(i => {
        if (i.id === id) {
            return {...i, selected: !i.selected}
        }
        return i;
    });
    localStorage.setItem("movies_gallery", JSON.stringify(updatedData));
    showData(updatedData);
    showFavoriteList(updatedData);
}

overlay.addEventListener('click', function () {
    hideModal();
});

function showModal(data) {
    const img = document.createElement("img");
    img.setAttribute("src", data.img);
    img.setAttribute("alt", data.name);
    const modalImg = createDivWithClassAndInnerHtml("modal-img");
    modalImg.appendChild(img);
    const modalYear = createDivWithClassAndInnerHtml("modal-year", data.year);
    const modalGenres = createDivWithClassAndInnerHtml("modal-genres");
    data.genres.map(i => {
        const genresItem = createDivWithClassAndInnerHtml("modal-genres-item", i);
        modalGenres.appendChild(genresItem);
    });
    const modalName = createDivWithClassAndInnerHtml("modal-name", data.name);
    const modalDescription = createDivWithClassAndInnerHtml("modal-description", data.description);
    const modalDirector = createDivWithClassAndInnerHtml("modal-director", `Director: ${data.director}`);
    const starringStr = data.starring.join(", ");
    const modalStarring = createDivWithClassAndInnerHtml("modal-starring", `Starring: ${starringStr}`);
    modalSide.innerHTML = modalImg.outerHTML + modalYear.outerHTML + modalGenres.outerHTML;
    modalMain.innerHTML = modalName.outerHTML + modalDescription.outerHTML + modalDirector.outerHTML + modalStarring.outerHTML

    modal.classList.add("active");
    overlay.classList.add("active");
}

function hideModal() {
    modal.classList.remove("active");
    overlay.classList.remove("active");
}


function showFavoriteList(data) {
    const selectedList = data.filter(i => i.selected);//

    if (selectedList.length) {
        list.innerHTML = "";
        const ul = document.createElement("ul");
        ul.setAttribute('class', "list-ul");
        selectedList.map(i => {
            const li = document.createElement("li");
            const closeImg = document.createElement("img");
            closeImg.setAttribute("src", "./assets/img/close.png");
            closeImg.addEventListener("click", (e) => toggleSelected(e, i.id));
            li.innerHTML = i.name;
            li.appendChild(closeImg);
            ul.appendChild(li);
        });
        list.appendChild(ul);
    } else {
        list.innerHTML = "You didn't add any movie";//
    }
}
function handleFilter (filterName) {
    const data = JSON.parse(localStorage.getItem('movies_gallery'));
    if (filterName === "all") {
        showData(data)
    } else {
        const updatedData = data.filter(i => i.genres.includes(filterName));
        showData(updatedData)
    }

}

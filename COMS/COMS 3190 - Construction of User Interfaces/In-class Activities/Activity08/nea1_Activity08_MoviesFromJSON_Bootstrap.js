/*
Author: Neal Kaushik Sharma
ISU Netid : nea1@iastate.edu
Date: February 28th, 2026
*/

function loadMovies(myMovies) {
    var CardMovie = document.getElementById("col");
    var checkboxes = [];
    var cards = [];

    for (var i = 0; i < myMovies.movies.length; i++) {
        let title = myMovies.movies[i].title;
        let year = myMovies.movies[i].year;
        let url = myMovies.movies[i].url;

        let checkbox = "checkbox" + i.toString();
        let card = "card" + i.toString();

        let AddCardMovie = document.createElement("div");
        AddCardMovie.classList.add("col");

        AddCardMovie.innerHTML = `
            <input type="checkbox" id=${checkbox} class="form-check-input" checked>
            <label for=${checkbox} class="form-check-label">Show Image ${i}</label>
            <div id=${card} class="card shadow-sm">
                <img src=${url} class="card-img-top" alt="..."></img>
                <div class="card-body">
                    <p class="card-text"> <strong>${title}</strong>, ${year}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                        </div>
                        <small class="text-body-secondary">9 mins</small>
                    </div>
                </div>
            </div>`;

        CardMovie.appendChild(AddCardMovie);

        let cbox = document.getElementById(checkbox);
        checkboxes.push(cbox);
        let ccard = document.getElementById(card);
        cards.push(ccard);
    }

    checkboxes.forEach((checkboxParam, index) => {
        checkboxParam.addEventListener('change', () => {
            if (checkboxParam.checked) {
                cards[index].style.display = 'block';
            } else {
                cards[index].style.display = 'none';
            }
        });
    });
}

fetch("./nea1_Activity08_MoviesFromJSON.json")
    .then(response => response.json())
    .then(myMovies => loadMovies(myMovies));
/*
Author: Neal Kaushik Sharma
ISU Netid : nea1@iastate.edu
Date: February 28th, 2026
*/

function loadMovies(myMovies) {
    var mainContainer = document.getElementById("goodmovies");
    for (var i = 0; i < myMovies.movies.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = `
            <h3>${myMovies.movies[i].title}</h3>
            <p>${myMovies.movies[i].year}</p>
            <img src="${myMovies.movies[i].url}" width="200">
        `;
        mainContainer.appendChild(div);
    }
}

fetch("./nea1_Activity08_MoviesFromJSON.json")
    .then(response => response.json())
    .then(myMovies => loadMovies(myMovies));
import API_KEY from "./tmdb_api.js"

// As per the the movie db doc, it's in the following format: http://image.tmdb.org/t/p/w500/your_poster_path
// Sources: https://developers.themoviedb.org/3/getting-started/images
//          https://stackoverflow.com/questions/63806137/how-to-fetch-images-from-response-of-themoviedb-api
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w500';

const movies = [
    {
        image: 'https://upload.wikimedia.org/wikipedia/en/1/17/Doctor_Strange_in_the_Multiverse_of_Madness_poster.jpg',
        title: 'Doutor Estranho no Multiverso da Loucura',
        rating: 9.2,
        year: 2022,
        description: 'Após eventos que abalaram o multiverso, Doutor Estranho se vê diante de um caos interdimensional desencadeado por forças poderosas e imprevisíveis. Com aliados improváveis, incluindo a jovem America Chavez, ele navega entre realidades alternativas enquanto luta para evitar que o multiverso caia em colapso.',
        isFavorited: false
    },
    {
      image: 'https://img.elo7.com.br/product/original/3FBA809/big-poster-filme-batman-2022-90x60-cm-lo002-poster-batman.jpg',
      title: 'Batman',
      rating: 9.2,
      year: 2022,
      description: 'Em uma Gotham sombria e caótica, Bruce Wayne, no início de sua carreira como o vigilante Batman, enfrenta um enigma mortal quando um serial killer conhecido como Charada começa a alvejar figuras influentes da cidade. Enquanto descobre segredos obscuros sobre Gotham e seu próprio legado, Batman é forçado a confrontar seus limites como detetive e herói.',
      isFavorited: true,
    },
    {
      image: 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9b/Avengers_Endgame.jpg/250px-Avengers_Endgame.jpg',
      title: 'Vingadores: Ultimato',
      rating: 9.2,
      year: 2019,
      description: 'Após o trágico estalar de dedos de Thanos, que eliminou metade da vida no universo, os Vingadores restantes enfrentam a perda e a desesperança. Unidos pela determinação de reparar os danos, eles embarcam em uma missão ousada que exige coragem, sacrifício e o máximo de suas habilidades em uma batalha épica pelo destino da humanidade.',
      isFavorited: false
    }
  ]

const moviesOnShow = []

window.addEventListener('load', (event) => {
    // movies.forEach(movie => renderMovie(movie));
    getPopularMovies().then( function(l) {
        moviesOnShow.push(...l); 
        moviesOnShow.forEach(movie => renderMovie(movie));
    });

    const searchInputElement = document.getElementById('movie-name');
    searchInputElement.addEventListener('keydown', function (event) {
        const keyName = event.key;

        if (keyName == "Enter") {
            let searchString = this.value;
            if (searchString) {
                pesquisar(searchString);
            }
        }
    });

    const searchIconElement = document.getElementsByClassName('searchIcon')[0];
    searchIconElement.addEventListener('click', function (event) {
        let searchString = document.getElementById('movie-name').value;
        
        if (searchString) {
            pesquisar(searchString);
        }
    });

    const checkboxElement = document.getElementById("onlyFavorites");
    checkboxElement.addEventListener("change", function(e) {
        if (this.checked) {
            showOnlyFavorite();
        } else {
            showMoviesOnlyIn(null);
        }
    });

});

function showOnlyFavorite() {
    const favoriteMovies = getFavoriteMovies();

    showMoviesOnlyIn(favoriteMovies);
}

function showMoviesOnlyIn(moviesOnShowSubset) {
    limparFilmes();

    if (moviesOnShowSubset) {
        moviesOnShowSubset.forEach(function (movie) {
            if (moviesOnShow.map(m => m.title).includes(movie.title)) {
                renderMovie(movie);
            }
        });
    } else {
        moviesOnShow.forEach(movie => renderMovie(movie));
    }
}

function getFavoriteMovies() {
    var favoriteMovies = JSON.parse(localStorage.getItem('MyMovieDatabase_Favorites'));

    if (favoriteMovies == null) 
        favoriteMovies = [];

    return favoriteMovies;
}

function saveToLocalStorage(movie) {
    const movies = getFavoriteMovies(); // busca os filmes favoritados no Local Storage
    movies.push(movie) // inclui o novo filme favorito no array


    const moviesJSON = JSON.stringify(movies);
    localStorage.setItem('MyMovieDatabase_Favorites', moviesJSON); // salva o array no Local Storage
}

function removeFromLocalStorage(movie) {
    const movies = getFavoriteMovies();
    
    const moviesJSON = JSON.stringify(
        movies.filter( e => e.title != movie.title)
    );
    localStorage.setItem('MyMovieDatabase_Favorites', moviesJSON)
}

function isFavorite(movie) {
    const movies = getFavoriteMovies();

    if (movies) {
        return movies.filter(
            favorite => favorite.title === movie.title
        ).length > 0;
    }

    return false;
}

function favorite(movie) {
    if (movie.isFavorited) {
        saveToLocalStorage(movie);
    } else {
        removeFromLocalStorage(movie);
    }
}

function pesquisar(titulo) {
    limparFilmes();
    moviesOnShow.splice(0);
    searchMoviesByTitle(titulo).then(function(l) {
        moviesOnShow.push(...l);
        moviesOnShow.forEach(movie => renderMovie(movie));
    });
}

function renderMovie(movie) {

    const moviesElement = document.getElementsByClassName('movies')[0];

    moviesElement.appendChild(renderMovieElement(movie));
}

function renderMovieImageElement(movie) {
    const movieImageElement = document.createElement('div');
    movieImageElement.classList.add('movie-image');
    
    const movieImage = document.createElement('img');
    movieImage.src=movie.image;
    movieImage.alt='Logo ' + movie.title;
    movieImageElement.appendChild(movieImage);
    
    return movieImageElement;
}

function renderMovieDescElement(movie) {
    const movieDescElement = document.createElement('div');
    movieDescElement.classList.add('movie-desc');

    const movieDesc = document.createElement('p');
    movieDesc.textContent=movie.description;

    movieDescElement.appendChild(movieDesc);

    return movieDescElement;
}

function renderMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    
    movieElement.appendChild(renderMovieImageElement(movie));
    
    movieElement.appendChild(renderMovieTitleElement(movie));

    movieElement.appendChild(renderMovieDescElement(movie));

    return movieElement;
}

function renderMovieTitleElement(movie) {
    
    const movieTitleElement = document.createElement('div');
    movieTitleElement.classList.add('movie-title');
    
    const titleElement = document.createElement('p');
    titleElement.textContent = movie.title;
    movieTitleElement.appendChild(titleElement);
    
    const movieDataElement = document.createElement('div');
    movieDataElement.classList.add('movie-data');
    
    movieDataElement.appendChild(renderMovieRatingElement(movie));

    movieDataElement.appendChild(renderMovieFavoriteElement(movie));

    movieTitleElement.appendChild(movieDataElement);
    
    return movieTitleElement;
}

function renderMovieRatingElement(movie) {
    const movieRatingElement = document.createElement('div');
    movieRatingElement.classList.add('movie-rating');
    
    const ratingImage = document.createElement('img');
    ratingImage.src='img/star.svg';
    ratingImage.alt='Star';
    ratingImage.classList.add('icon');
    movieRatingElement.appendChild(ratingImage);
    
    const rating = document.createElement('span');
    rating.textContent=movie.rating;
    rating.style='margin-right: 2rem';
    movieRatingElement.appendChild(rating);

    return movieRatingElement;
}

function renderMovieFavoriteElement(movie) {
    const movieFavoriteElement = document.createElement('div');
    movieFavoriteElement.classList.add('movie-favorite');
    
    const favoriteImage = document.createElement('img');
    favoriteImage.src = movie.isFavorited ? 'img/heart.svg' : 'img/heart-empty.svg';
    favoriteImage.classList.add('icon');
    favoriteImage.id = movie.id;

    favoriteImage.addEventListener('click', function (event) {
        let id = this.id;
        
        moviesOnShow.forEach(function(movie) {
            if (movie.id == id) {
                movie.isFavorited = !movie.isFavorited;
                if (movie.isFavorited) {
                    console.log(`Saved to Local Storage Favorites ${movie.title}`);
                    document.getElementById(id).src = 'img/heart.svg';
                    saveToLocalStorage(movie);
                } else {
                    console.log(`Deleted from Local Storage Favorites ${movie.title}`);
                    document.getElementById(id).src = 'img/heart-empty.svg';
                    removeFromLocalStorage(movie);
                }
            }
        });
    });

    movieFavoriteElement.appendChild(favoriteImage);

    const favorite = document.createElement('span');
    favorite.textContent = 'Favoritar';
    movieFavoriteElement.appendChild(favorite);

    return movieFavoriteElement;
}

async function getPopularMovies() {

    const urlPopularMovies = 'https://api.themoviedb.org/3/movie/popular?' + new URLSearchParams({ language: "pt-BR", page: 1 }).toString();

    var moviesTmdb = [];
    var reqHeaders = new Headers();
    reqHeaders.append("Accept", "application/json");
    reqHeaders.append("Authorization", "Bearer " + API_KEY);

    var reqInit = {
        method: "GET",
        headers: reqHeaders,
        mode: "cors",
        cache: "default",
    }

    var authRequest = new Request(urlPopularMovies, reqInit);

    try {
        let response = await fetch(authRequest);
        let json = await response.json();
        json.results.forEach(function (e, i) {
            let movie = jsonToMovie(e);
            movie.isFavorited = isFavorite(movie);
            moviesTmdb.push(movie);
        });
    } catch (error) {
        console.log("There has been a problem with your fetch operation: " + error.message);
    }

    return moviesTmdb;

}

async function searchMoviesByTitle(title) {

    const urlSearchMovieByTitle = 'https://api.themoviedb.org/3/search/movie?' + new URLSearchParams({ language: "pt-BR", page: 1, query: title }).toString();

    var moviesTmdbFound = [];
    var reqHeaders = new Headers();
    reqHeaders.append("Accept", "application/json");
    reqHeaders.append("Authorization", "Bearer " + API_KEY);

    var reqInit = {
        method: "GET",
        headers: reqHeaders,
        mode: "cors",
        cache: "default",
    }

    var authRequest = new Request(urlSearchMovieByTitle, reqInit);

    try {
        let response = await fetch(authRequest);
        let json = await response.json();
        json.results.forEach(function (e, i) {
            let movie = jsonToMovie(e);
            movie.isFavorited = isFavorite(movie);
            moviesTmdbFound.push(movie);
        });
    } catch (error) {
        console.log("There has been a problem with your fetch operation: " + error.message);
    }

    return moviesTmdbFound;

}

function jsonToMovie(e) {
    return {
        id: e.id,
        image: getTmdbImageFullPath(e.poster_path),
        title: e.title,
        rating: e.vote_average,
        year: e.release_date ? parseInt(e.release_date.substring(0, 4), 10) : '-',
        description: e.overview,
        isFavorited: false
    };
}

function getTmdbImageFullPath(objectName) {
    return IMAGE_PATH + objectName;
}

function limparFilmes() {
    const moviesElement = document.getElementsByClassName('movies')[0];
    limparConteudoDOMElement(moviesElement);
}

function limparConteudoDOMElement(element) {
    element.replaceChildren();
}

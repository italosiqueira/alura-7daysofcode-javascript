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

window.addEventListener('load', (event) => {
    // movies.forEach(movie => renderMovie(movie));
    getPopularMovies().then(l => l.forEach(movie => renderMovie(movie)));

    
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
});

function pesquisar(titulo) {
    limparFilmes();
    searchMoviesByTitle(titulo).then(l => l.forEach(movie => renderMovie(movie)));
}

function renderMovie(movie) {

    const moviesElement = document.getElementsByClassName('movies')[0];

    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    
    const movieImageElement = document.createElement('div');
    movieImageElement.classList.add('movie-image');
    
    const movieImage = document.createElement('img');
    movieImage.src=movie.image;
    movieImage.alt='Logo ' + movie.title;
    movieImageElement.appendChild(movieImage);
    movieElement.appendChild(movieImageElement);
    
    const movieTitleElement = document.createElement('div');
    movieTitleElement.classList.add('movie-title');
    
    const titleElement = document.createElement('p');
    titleElement.textContent = movie.title;
    movieTitleElement.appendChild(titleElement);
    
    const movieDataElement = document.createElement('div');
    movieDataElement.classList.add('movie-data');
    
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
    
    movieDataElement.appendChild(movieRatingElement);

    const movieFavoriteElement = document.createElement('div');
    movieFavoriteElement.classList.add('movie-favorite');
    
    const favoriteImage = document.createElement('img');
    favoriteImage.src = movie.isFavorited ? 'img/heart.svg' : 'img/heart-empty.svg';
    favoriteImage.classList.add('icon');
    movieFavoriteElement.appendChild(favoriteImage);

    const favorite = document.createElement('span');
    favorite.textContent = movie.isFavorited ? 'Desfavoritar' : 'Favoritar';
    movieFavoriteElement.appendChild(favorite);

    movieDataElement.appendChild(movieFavoriteElement);

    movieTitleElement.appendChild(movieDataElement);
    
    movieElement.appendChild(movieTitleElement);

    const movieDescElement = document.createElement('div');
    movieDescElement.classList.add('movie-desc');

    const movieDesc = document.createElement('p');
    movieDesc.textContent=movie.description;

    movieDescElement.appendChild(movieDesc);

    movieElement.appendChild(movieDescElement);

    moviesElement.appendChild(movieElement);
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
        year: parseInt(e.release_date.substring(0, 4), 10),
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

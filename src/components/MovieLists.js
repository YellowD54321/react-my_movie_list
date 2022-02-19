import React from "react";
import OverviewMovies from "./OverviewMovies";
import FavoriteMovies from "./FavoriteMovies";
import BlackMovies from "./BlackMovies";

function MovieLists() {
  const imgPageLeft = "./images/icon-page_left.png";
  const imgPageRight = "./images/icon-page_right.png";

  const [seachBarContent, setSearchBarContent] = React.useState({
    searchBar: "",
  });
  const [allMovie, setAllMovie] = React.useState([]);
  const [moviePage, setMoviePage] = React.useState({
    favorite: 1,
    overview: 1,
    black: 1,
  });
  const [movieHide, setMovieHide] = React.useState({
    favorite: false,
    overview: false,
    black: true,
  });
  const [allMovieList, setAllMovieList] = React.useState({
    overview: [],
    favorite: [],
    black: [],
  });
  const maxCulomn = 5;
  const maxRow = {
    favorite: 1,
    overview: 2,
    black: 1,
  };
  let maxPage = {
    favorite: 0,
    overview: 0,
    black: 0,
  };

  React.useEffect(() => {
    async function getMoviesFromAPI() {
      const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=84177742862ee7332d09ffd2dd34b814&language=en-US&page=1"
      );
      const data = await res.json();
      const dataWithClass = data.results.map((predata) => {
        return {
          ...predata,
          class: {
            overview: true,
            favorite: false,
            black: false,
          },
        };
      });
      setAllMovie(dataWithClass);
    }
    getMoviesFromAPI();
  }, []);

  React.useEffect(() => {
    setAllMovieList(() => {
      const overviewMovies = [];
      const favoriteMovies = [];
      const blackMovies = [];
      const searchBar =
        seachBarContent.searchBar && seachBarContent.searchBar.length > 0
          ? seachBarContent.searchBar.toLowerCase()
          : "";
      allMovie.forEach((movie) => {
        if (
          !(
            movie.title.toLowerCase().includes(searchBar) ||
            movie.overview.toLowerCase().includes(searchBar)
          )
        ) {
          return;
        }
        if (movie.class.overview && !movie.class.black) {
          overviewMovies.push(movie);
        }
        if (movie.class.favorite && !movie.class.black) {
          favoriteMovies.push(movie);
        }
        if (movie.class.black) {
          blackMovies.push(movie);
        }
      });
      return {
        overview: overviewMovies,
        favorite: favoriteMovies,
        black: blackMovies,
      };
    });
  }, [allMovie, seachBarContent]);

  if (!allMovie || allMovie.length <= 0) {
    console.log("No movie data fetch from API.");
    return false;
  }

  // console.log("allMovieList = ");
  // console.log(allMovieList);

  initializeAllMovie(allMovieList);

  const overviewMoviesInCurrentPage = setMoviesInCurrentPage("overview");
  const favoriteMoviesInCurrentPage = setMoviesInCurrentPage("favorite");
  const blackMoviesInCurrentPage = setMoviesInCurrentPage("black");

  const overviewMoviesImgSrc = overviewMoviesInCurrentPage.map((data) => {
    return (
      <OverviewMovies
        key={data.id}
        {...data}
        setFavorite={() => setFavorite(data.id)}
        setBlack={() => setBlack(data.id)}
        isFavorite={() => isFavorite(data.id)}
      />
    );
  });

  const favoriteMoviesImgSrc = favoriteMoviesInCurrentPage.map((data) => {
    return (
      <FavoriteMovies
        key={data.id}
        {...data}
        setFavorite={() => setFavorite(data.id)}
        isFavorite={() => isFavorite(data.id)}
      />
    );
  });

  const blackMoviesImgSrc = blackMoviesInCurrentPage.map((data) => {
    return (
      <BlackMovies
        key={data.id}
        {...data}
        setFavorite={() => setFavorite(data.id)}
        removeBlack={() => removeBlack(data.id)}
        isFavorite={() => isFavorite(data.id)}
      />
    );
  });

  function initializeAllMovie(movieList) {
    maxPage.overview = Math.ceil(
      movieList.overview.length / (maxCulomn * maxRow.overview)
    );
    maxPage.favorite = Math.ceil(
      movieList.favorite.length / (maxCulomn * maxRow.favorite)
    );
    maxPage.black = Math.ceil(
      movieList.black.length / (maxCulomn * maxRow.black)
    );
  }

  function flipPage(event) {
    const { name, value } = event.target;
    const nextPage =
      moviePage[name] + Number(value) > maxPage[name] ||
      moviePage[name] + Number(value) <= 0
        ? moviePage[name]
        : (moviePage[name] += Number(value));
    setMoviePage((prePage) => ({
      ...prePage,
      [name]: nextPage,
    }));
  }

  function setMoviesInCurrentPage(movieClass) {
    let moviesInCurrentPage = [];
    if (allMovieList[movieClass].length > maxCulomn * maxRow[movieClass]) {
      moviesInCurrentPage = allMovieList[movieClass].slice(
        maxCulomn * maxRow[movieClass] * (moviePage[movieClass] - 1),
        maxCulomn * maxRow[movieClass] * moviePage[movieClass]
      );
    } else {
      moviesInCurrentPage = allMovieList[movieClass];
    }
    return moviesInCurrentPage;
  }

  function setFavorite(movieId) {
    setAllMovie((preMovies) => {
      return preMovies.map((movie) => {
        if (movie.id === movieId) {
          return {
            ...movie,
            class: {
              ...movie.class,
              favorite: !movie.class.favorite,
            },
          };
        } else {
          return movie;
        }
      });
    });
  }

  function setBlack(movieId) {
    setAllMovie((preMovies) => {
      return preMovies.map((movie) => {
        if (movie.id === movieId) {
          return {
            ...movie,
            class: {
              ...movie.class,
              overview: false,
              favorite: false,
              black: true,
            },
          };
        } else {
          return movie;
        }
      });
    });
  }

  function removeBlack(movieId) {
    setAllMovie((preMovies) => {
      return preMovies.map((movie) => {
        if (movie.id === movieId) {
          return {
            ...movie,
            class: {
              ...movie.class,
              overview: true,
              favorite: false,
              black: false,
            },
          };
        } else {
          return movie;
        }
      });
    });
  }

  function setHide(event) {
    const name = event.target.name;
    setMovieHide((preCondition) => {
      return {
        ...preCondition,
        [name]: !preCondition[name],
      };
    });
  }

  function isFavorite(movieId) {
    const movie = allMovie.find((movie) => movie.id === movieId);
    if (!movie) return false;
    return movie.class.favorite;
  }

  function isHide(movieClass) {
    return movieHide[movieClass];
  }

  function searchBarChange(event) {
    const { name, value } = event.target;
    setSearchBarContent((preContent) => ({
      ...preContent,
      [name]: value,
    }));
  }

  return (
    <div className="allLists">
      <header>
        <input
          type="text"
          className="search-bar"
          name="searchBar"
          onChange={searchBarChange}
        />
      </header>
      <div className="favorite-list">
        <div className="favorite-list-header">
          <button
            className={"favorite-list-hide-btn hide-btn"}
            name="favorite"
            onClick={setHide}
          >
            {isHide("favorite") ? `+` : `-`}
          </button>
          <h2>Favorite List</h2>
        </div>
        {!isHide("favorite") && (
          <div className="favorite-list-body">
            <button
              className={"page-btn page-btn-left"}
              name="favorite"
              value={-1}
              onClick={flipPage}
              style={{
                backgroundImage: `url(${imgPageLeft})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `50% 50%`,
              }}
            ></button>
            <div className={"favorite-list-movies list-movies"}>
              {favoriteMoviesImgSrc}
            </div>
            <button
              className={"page-btn page-btn-right"}
              name="favorite"
              value={1}
              onClick={flipPage}
              style={{
                backgroundImage: `url(${imgPageRight})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `50% 50%`,
              }}
            ></button>
          </div>
        )}
      </div>
      <div className="overview-list">
        <div className="overview-list-header">
          <button
            className="overview-list-hide-btn hide-btn"
            name="overview"
            onClick={setHide}
          >
            {isHide("overview") ? `+` : `-`}
          </button>
          <h2>Overview List</h2>
        </div>

        {!isHide("overview") && (
          <div className="overview-list-body">
            <button
              className={"page-btn page-btn-left"}
              name="overview"
              value={-1}
              onClick={flipPage}
              style={{
                backgroundImage: `url(${imgPageLeft})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `50% 50%`,
              }}
            ></button>
            <div className={"overview-list-movies list-movies"}>
              {overviewMoviesImgSrc}
            </div>
            <button
              className={"page-btn page-btn-right"}
              name="overview"
              value={1}
              onClick={flipPage}
              style={{
                backgroundImage: `url(${imgPageRight})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `50% 50%`,
              }}
            ></button>
          </div>
        )}
      </div>
      <div className="black-list">
        <div className="black-list-header">
          <button
            className="black-list-hide-btn hide-btn"
            name="black"
            onClick={setHide}
          >
            {isHide("black") ? `+` : `-`}
          </button>
          <h2>Black List</h2>
        </div>
        {!isHide("black") && (
          <div className="black-list-body">
            <button
              className={"page-btn page-btn-left"}
              name="black"
              value={-1}
              onClick={flipPage}
              style={{
                backgroundImage: `url(${imgPageLeft})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `50% 50%`,
              }}
            ></button>
            <div className={"black-list-movies list-movies"}>
              {blackMoviesImgSrc}
            </div>
            <button
              className={"page-btn page-btn-right"}
              name="black"
              value={1}
              onClick={flipPage}
              style={{
                backgroundImage: `url(${imgPageRight})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `50% 50%`,
              }}
            ></button>
          </div>
        )}
      </div>
    </div>
  );
}
export default MovieLists;

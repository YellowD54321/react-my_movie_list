import MovieImgSrc from "./MovieImgSrc";
function FavoriteMovies(props) {
  const starIconImg = props.isFavorite()
    ? "icon-star_full.png"
    : "icon-star_empty.png";
  return (
    <div className="movie-poster-region">
      <MovieImgSrc key={props.id} {...props} />
      <img
        className="star-icon"
        src={`./images/${starIconImg}`}
        onClick={props.setFavorite}
        alt=""
      />
    </div>
  );
}
export default FavoriteMovies;

import MovieImgSrc from "./MovieImgSrc";
function OverviewMovies(props) {
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
      <img
        className="redCross-icon"
        src="./images/icon-red_cross.png"
        onClick={props.setBlack}
        alt=""
      />
    </div>
  );
}
export default OverviewMovies;

import MovieImgSrc from "./MovieImgSrc";
function BlackMovies(props) {
  return (
    <div className="movie-poster-region">
      <MovieImgSrc key={props.id} {...props} />
      <img
        className="undo-icon"
        src="./images/icon-undo.png"
        onClick={props.removeBlack}
        alt=""
      />
    </div>
  );
}
export default BlackMovies;

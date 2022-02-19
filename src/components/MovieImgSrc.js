function MovieImgSrc(props) {
  return (
    <img
      className="movie-poster"
      src={`https://www.themoviedb.org/t/p/w300_and_h450_bestv2${props.backdrop_path}`}
      alt=""
    />
  );
}
export default MovieImgSrc;

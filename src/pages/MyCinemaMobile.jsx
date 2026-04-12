import MovieCard from "../components/MovieCard";

function MyCinemaMobile({ films }) {
  return (
    <div style={{ padding: "12px", background: "#000" }}>
      <h2 style={{ color: "white", marginBottom: "16px" }}>MyCinema</h2>

      <p style={{ color: "white" }}>
        MOBILE WORKING - Films: {films.length}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px"
        }}
      >
        {films.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MyCinemaMobile;
import MovieCard from "../components/MovieCard";

function MyCinemaMobile({ films }) {
  return (
    <div style={{ padding: "12px", background: "#000", minHeight: "100vh" }}>
      <h2 style={{ color: "white", marginBottom: "16px" }}>MyCinema</h2>

      {/* DEBUG (remove later) */}
      <p style={{ color: "white" }}>
        Films loaded: {films?.length || 0}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px"
        }}
      >
        {(films || []).map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default MyCinemaMobile;
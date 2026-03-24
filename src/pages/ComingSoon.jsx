import ComingSoonFilms from "../components/ComingSoonFilms";

function ComingSoon() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Coming Soon</h1>
      </div>

      <ComingSoonFilms />
    </div>
  );
}

const styles = {
  page: {
    background: "#000",
    minHeight: "100vh",
    color: "white"
  },
  hero: {
    height: "320px",
    background:
      "linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "flex-start",
    paddingLeft: "80px",
    paddingTop: "80px"
  },
  title: {
    fontSize: "72px",
    fontWeight: "bold",
    margin: 0
  }
};

export default ComingSoon;
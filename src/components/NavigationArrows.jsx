import { useNavigate } from "react-router-dom";

function NavigationArrows() {

  const navigate = useNavigate();

  const style = {
    position: "fixed",
    top: "50%",
    transform: "translateY(-50%)",
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "black",
    border: "2px solid #1e90ff",
    color: "white",
    fontSize: "26px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    zIndex: 2000
  };

  return (
    <>
      {/* BACK */}
      <button
        style={{ ...style, left: "20px" }}
        onClick={() => navigate(-1)}
        onMouseEnter={(e) => {
          e.target.style.background = "red";
          e.target.style.transform = "translateY(-50%) scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "black";
          e.target.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        ←
      </button>

      {/* FORWARD */}
      <button
        style={{ ...style, right: "20px" }}
        onClick={() => navigate(1)}
        onMouseEnter={(e) => {
          e.target.style.background = "red";
          e.target.style.transform = "translateY(-50%) scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "black";
          e.target.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        →
      </button>
    </>
  );
}

export default NavigationArrows;
import { useNavigate } from "react-router-dom";

function NavigationArrows() {

  const isMobile = window.innerWidth <= 768;
  const navigate = useNavigate();

  const style = {
  position: "fixed",
  top: isMobile ? "30%" : "50%",
  transform: isMobile ? "translateY(-30%)" : "translateY(-50%)",
  width: isMobile ? "40px" : "55px",
  height: isMobile ? "40px" : "55px",
  borderRadius: "50%",
  background: "black",
  border: "2px solid #1e90ff",
  color: "white",
  fontSize: isMobile ? "18px" : "26px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.3s ease",
  zIndex: 2000,
  opacity: 0.8
};

  return (
    <>
      {/* BACK */}
      <button
        style={{ ...style, left: "20px" }}
        onClick={() => navigate(-1)}
        onMouseEnter={(e) => {
  e.target.style.background = "red";
  e.target.style.transform = isMobile
    ? "translateY(-30%) scale(1.2)"
    : "translateY(-50%) scale(1.2)";
  e.target.style.opacity = "1";   // ✅ ADD HERE
}}
        onMouseLeave={(e) => {
  e.target.style.background = "black";
  e.target.style.transform = isMobile
    ? "translateY(-30%) scale(1)"
    : "translateY(-50%) scale(1)";
  e.target.style.opacity = "0.8"; // ✅ ADD HERE
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
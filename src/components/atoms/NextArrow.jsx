import React from "react";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="slick-arrow slick-next"
      onClick={onClick}
      style={{
        display: "block",
        background: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        padding: "10px",
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      →
    </div>
  );
};
export default NextArrow;
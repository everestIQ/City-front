// src/components/Loader.jsx
import "./Loader.css";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="loader-inline">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  );
}

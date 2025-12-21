// src/components/SplashScreen.jsx
import { useEffect } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200); // 2.2 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-container">
      <div className="logo">FCB</div>
      <div className="loader"></div>
      <p>Securing your experience...</p>
    </div>
  );
}

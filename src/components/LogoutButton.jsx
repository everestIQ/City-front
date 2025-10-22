// components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { clearAuthData } from "../utils/auth";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    navigate("/login"); // or "/admin-login" depending on role
  };

  return <button onClick={handleLogout}>Logout</button>;
}

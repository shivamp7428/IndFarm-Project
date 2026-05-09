import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token); 
      console.log("Login Successful, Token Saved!");
      navigate("/dashboard"); 
    } else {
      navigate("/login"); 
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging you in...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
};

export default LoginSuccess;
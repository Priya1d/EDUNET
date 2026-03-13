import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import alertContext from "../context/Alert/alertContext";
import loginimg from "./assets/login.svg";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";

const Login = () => {
  const { showAlert } = useContext(alertContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // const host = process.env.REACT_APP_URL; --- IGNORE ---

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();

      if (response.ok && json.authToken) {
        // ✅ CORRECT KEY
        localStorage.setItem("token", json.authToken);

        showAlert("Welcome back! Successfully logged in.", "success");
        navigate("/");
      } else {
        showAlert(json.error||"Invalid credentials. Please try again.", "warning");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showAlert( "Server error. Please try later.", "danger");
    }
  };

  return (
    <div className="container my-5">
      <div className="row py-5 mt-4 align-items-center">
        <div className="col-md-5 d-none d-md-block">
          <img src={loginimg} alt="Login" className="img-fluid" />
        </div>

        <div className="col-md-6 col-lg-5 ml-auto">
          <h2 className="mb-4" style={{ color: "darkred", fontWeight: "bold" }}>
            Log in
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-outline mb-4 material-textfield">
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                onChange={onChange}
                required
              />
              <label>Email address</label>
            </div>

            <div className="form-outline mb-3 material-textfield">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control form-control-lg"
                onChange={onChange}
                required
                minLength={5}
              />
              <label>Password</label>

              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RiEyeOffFill /> : <RiEyeFill />}
              </span>
            </div>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary btn-lg mb-3">
                Login
              </button>

              <p className="small fw-bold mt-2">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="link-danger">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

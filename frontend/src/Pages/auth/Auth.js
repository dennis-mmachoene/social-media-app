import React, { useState } from "react";
import "./Auth.css";
import Logo from "../../Img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logIn, signUp } from '../../actions/AuthAction';
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpass: "",
  });
  const [confirmPass, setConfirmPass] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.authReducer);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (data.password !== data.confirmpass) {
        setConfirmPass(false);
        return;
      }
      dispatch(signUp(data));
    } else {
      dispatch(logIn(data));
    }
  };

  // Watch for authData changes in Redux and navigate
  const authData = useSelector((state) => state.authReducer.authData);
  if (authData) {
    navigate("/home");
  }

  return (
    <div className="Auth">
      {/* Left Side */}
      <div className="a-left">
        <img src={Logo} alt="logo" />
        <div className="Webname">
          <h2>Welcome!</h2>
          <h5>Explore ideas throughout the world.</h5>
        </div>
      </div>

      {/* Right Side */}
      <div className="a-right">
        <form className="infoForm authForm" onSubmit={handleSubmit}>
          <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>

          {isSignUp && (
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="infoInput"
                name="firstname"
                onChange={handleChange}
                value={data.firstname}
              />
              <input
                type="text"
                placeholder="Last Name"
                className="infoInput"
                name="lastname"
                onChange={handleChange}
                value={data.lastname}
              />
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Email"
              className="infoInput"
              name="email"
              onChange={handleChange}
              value={data.email}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="infoInput"
              name="password"
              onChange={handleChange}
              value={data.password}
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="infoInput"
                name="confirmpass"
                onChange={handleChange}
                value={data.confirmpass}
              />
            )}
          </div>

          {!confirmPass && (
            <span style={{ color: "red", fontSize: "12px" }}>
              * Passwords do not match.
            </span>
          )}

          <div>
            <span
              style={{ fontSize: "12px", cursor: "pointer" }}
              onClick={() => {
                setIsSignUp((prev) => !prev);
                setData({
                  firstname: "",
                  lastname: "",
                  email: "",
                  password: "",
                  confirmpass: "",
                });
                setConfirmPass(true);
              }}
            >
              {isSignUp
                ? "Already have an account? Login here"
                : "Don't have an account? Sign Up here"}
            </span>
          </div>

          <button className="button infoButton" type="submit" disabled={loading}>
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
          {error && (
            <span style={{ color: "red", fontSize: "12px" }}>
              Something went wrong. Please try again.
            </span>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;

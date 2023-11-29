import React, { useState, FormEvent } from "react";
import "./Signup.css";
import isroImg from "./isro.png";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vesselType, setVesselType] = useState("");
  const [username, setUsername] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const isEmailValid = (email: string) => {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isPasswordValid = (password: string) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_]).{8,12}$/;
    return passwordPattern.test(password);
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();

    if (!isEmailValid(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid(password)) {
      alert("Password must be 8-12 characters and contain at least 1 capital letter and 1 special character.");
      return;
    }

    if (password !== passwordConfirmation) {
      alert("Password and confirmation do not match.");
      return;
    }

    // Your signup logic here
    console.log("Signing up with email:", email);
    console.log("Password:", password);
    console.log("Vessel Type:", vesselType);
    console.log("Username:", username);
    
    const form = document.getElementById('myForm') as HTMLFormElement;
    form.submit();
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src={isroImg} alt="Signup" className="signup-image" />
        <p>SAFE SHIP NAVIGATION</p>
        <form id="myForm" onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username here"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Vessel Type:</label>
            <div className="vessel-type-options">
              <label>
                <input
                  type="radio"
                  value="Vessel 1"
                  checked={vesselType === "Vessel 1"}
                  onChange={() => setVesselType("Vessel 1")}
                />
                Vessel 1
              </label>
              <label>
                <input
                  type="radio"
                  value="Vessel 2"
                  checked={vesselType === "Vessel 2"}
                  onChange={() => setVesselType("Vessel 2")}
                />
                Vessel 2
              </label>
            </div>
            </div>


          <button type="submit" className="submit-button">
            Sign-up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

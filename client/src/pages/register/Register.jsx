import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    dept: "",
    enrollmentYear: "",
    company: "",
    position: "",
    gradYear: "",
    alumniFlag: 0, // default to student
  });
  const [err, setErr] = useState(null);
  const [isAlumni, setIsAlumni] = useState(false); // Alumni or Student toggle

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (e) => {
    setIsAlumni(e.target.value === "alumni");
    setInputs((prev) => ({ ...prev, alumniFlag: e.target.value === "alumni" ? 1 : 0 }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://alumniapp-server.vercel.app/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>BRACU ALUMNI NETWORK</h1>
          <p>
            Join the community to connect with students and alumni.
          </p>
          <span>Already have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />

            {/* Radio buttons for Student/Alumni */}
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={!isAlumni}
                  onChange={handleRoleChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="alumni"
                  checked={isAlumni}
                  onChange={handleRoleChange}
                />
                Alumni
              </label>
            </div>

            {/* Conditional Fields */}
            {isAlumni ? (
              <>
                <input
                  type="text"
                  placeholder="Department"
                  name="dept"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Graduation Year"
                  name="gradYear"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Company"
                  name="company"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Position"
                  name="position"
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Department"
                  name="dept"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  placeholder="Enrollment Year"
                  name="enrollmentYear"
                  onChange={handleChange}
                />
              </>
            )}

            {err && <span>{err}</span>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

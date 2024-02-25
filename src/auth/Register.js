import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({ setLogin }) => {
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const fullNameRef = useRef();
  const phoneRef = useRef();
  const roleRef = useRef();
  const [errors, setErrors] = useState([]);

  async function onRegister(e) {
    e.preventDefault();
    const email = emailRef.current.value.trim().toLowerCase();
    const password = passwordRef.current.value.trim().toLowerCase();
    const name = fullNameRef.current.value.trim();
    const phone = phoneRef.current.value.trim();
    const role = roleRef.current.value;

    // Send login data to database
    const registerData = { email, password, name, phone, role };
    const res = await fetch(
      "https://ecommerce-node-app-sfau.onrender.com/admin/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      }
    );

    const data = await res.json();
    if (res.status === 500 || res.status === 401) {
      setErrors(data.errors);
      console.log(data.errors);
      return;
    }
    setLogin(true);
    return navigate("/auth");
  }

  return (
    <td className="col col-10 d-flex flex-column text-center mt-5">
      {/* Show errors if any */}
      <ul className="ps-3 mx-auto">
        {errors &&
          errors.map((error, i) => {
            return (
              <li className="text-start text-danger fst-italic" key={i}>
                {error.msg}
              </li>
            );
          })}
      </ul>

      <form
        className="container d-flex flex-column gap-2"
        style={{ width: "450px" }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email*"
          className="border-light-subtle form-control"
          ref={emailRef}
        />
        <input
          type="text"
          name="name"
          placeholder="Full name*"
          className="border-light-subtle form-control"
          ref={fullNameRef}
        />
        <input
          type="password"
          name="password"
          placeholder="Password* (must have at least 8 characters)"
          className="border-light-subtle form-control"
          ref={passwordRef}
        />
        <input
          type="number"
          name="phonenumer"
          placeholder="Phone number*"
          className="border-light-subtle form-control"
          ref={phoneRef}
        />
        <select className="form-control" name="role" ref={roleRef}>
          Role
          <option value="" disabled selected>
            Please choose the role
          </option>
          <option value="admin">Admin</option>
          <option value="consultant">Consultant</option>
        </select>

        <button
          className="btn btn-dark text-white pt-2 mt-3 w-100 rounded-1"
          onClick={onRegister}
        >
          Register
        </button>
      </form>
    </td>
  );
};
export default Register;

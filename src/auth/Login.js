import { useState, useRef } from "react";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState([]);

  async function onLogin(e) {
    e.preventDefault();
    const email = emailRef.current.value.trim().toLowerCase();
    const password = passwordRef.current.value.trim().toLowerCase();
    const loginData = { email, password };

    // Send login data to backend
    const res = await fetch(
      "https://ecommerce-node-app-sfau.onrender.com/admin/login",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
      }
    );

    const data = await res.json();
    if (res.status === 500 || res.status === 401) {
      setErrors(data.errors);
      console.log(data.errors);
      return;
    }

    // Store user id in local storage
    localStorage.setItem("adminUser", JSON.stringify(data.adminUserData));
    // // Create expiration time for this user data
    // const expiration = new Date();
    // expiration.setHours(expiration.getHours() + 1); // set expiration to 1 hour later
    // localStorage.setItem("adminExpiration", JSON.stringify(expiration));

    setErrors([]);
    // Force to reload
    return window.location.assign("/");
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
          type="password"
          name="password"
          placeholder="Password* (must have at least 6 characters)"
          className="border-light-subtle form-control"
          ref={passwordRef}
        />

        <button
          type="submit"
          className="btn btn-dark text-white pt-2 mt-3 w-100 rounded-1"
          onClick={onLogin}
        >
          Login
        </button>
      </form>
    </td>
  );
};
export default Login;

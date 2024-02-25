import Login from "./Login";
import Register from "./Register";
import { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container-fluid mt-3">
      <table
        className="table"
        style={{ height: "100vh", backgroundColor: "transparent !important" }}
      >
        <tbody>
          <tr className="row">
            <td className="col col-2 border-2 border-top-0">
              <div
                className="fw-bold text-center fs-4"
                style={{ color: "#dc3545" }}
              >
                Admin Page
              </div>
            </td>
            <td className="col col-10 border-2 border-top-0 border-start-0"></td>
          </tr>

          <tr className="row h-100">
            <td className="col col-2 border-2 border-top-0 pt-4 d-flex flex-column align-items-center gap-3">
              <button
                className="btn text-white"
                style={{
                  width: "77px",
                  backgroundColor: `${isLogin ? "#dc3545" : "#111"}`
                }}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>

              <button
                className="btn text-white"
                style={{
                  width: "77px",
                  backgroundColor: `${isLogin ? "#111" : "#dc3545"}`
                }}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </td>

            {isLogin ? <Login /> : <Register setLogin={setIsLogin} />}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Auth;

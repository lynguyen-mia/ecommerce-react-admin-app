import { NavLink, useNavigate } from "react-router-dom";
import { getVariable } from "../utils/getLocalVar";
import { useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const adminUser = getVariable("adminUser");

  async function onLogout() {
    try {
      await fetch("https://ecommerce-node-app-sfau.onrender.com/admin/logout", {
        credentials: "include"
      });
      // Delete data in local storage
      localStorage.removeItem("adminUser");
      return navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  }

  // Check user expiration
  useEffect(() => {
    if (adminUser) {
      async function checkSession() {
        const res = await fetch(
          "https://ecommerce-node-app-sfau.onrender.com/admin/check-session",
          {
            credentials: "include"
          }
        );
        if (res.status === 401) {
          localStorage.removeItem("adminUser");
        }
      }
      checkSession();
    }
  }, [adminUser]);

  return (
    <div id="navBar" className="d-flex flex-column gap-4">
      {/* Not logged in */}
      {!adminUser && (
        <a
          href="/auth"
          className="btn text-white"
          style={{ backgroundColor: "#111" }}
        >
          Login
        </a>
      )}

      {/* Logged in */}
      {adminUser && (
        <div className="d-flex flex-column gap-2">
          <div className="navbar-title">MAIN</div>
          {adminUser.role === "admin" && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <i className="bi bi-columns-gap me-1 ms-2"></i>
              <span>Dashboard</span>
            </NavLink>
          )}
          {adminUser.role === "admin" && (
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "active-link" : undefined
              }
            >
              <i className="bi bi-diagram-3 me-1 ms-2"></i>
              <span>Products</span>
            </NavLink>
          )}

          <NavLink
            to="/livechat"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            <i className="bi bi-chat-dots me-1 ms-2"></i>
            <span>Live Chat</span>
          </NavLink>
        </div>
      )}

      {adminUser && adminUser.role === "admin" && (
        <div className="d-flex flex-column gap-2">
          <div className="navbar-title">NEW</div>
          <NavLink
            to="/add-product"
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
          >
            <i className="bi bi-door-open me-1 ms-2"></i>
            <span>Add Product</span>
          </NavLink>
        </div>
      )}

      {adminUser && (
        <div className="d-flex flex-column gap-2">
          <div className="navbar-title">USER</div>
          <NavLink to="/" onClick={onLogout}>
            <i className="bi bi-box-arrow-right me-1 ms-2"></i>
            <span>Logout</span>
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;

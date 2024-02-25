import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVariable } from "../utils/getLocalVar";

const Header = () => {
  // Get current logged-in user
  const adminUser = getVariable("adminUser");

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
    <tr className="row">
      <td className="col col-2 border-2 border-top-0">
        <Link to="/">
          <div
            className="fw-bold text-center fs-4"
            style={{ color: "#dc3545" }}
          >
            Admin Page
          </div>
        </Link>
      </td>

      <td className="col col-10 border-2 border-top-0 border-start-0 border-end-0 text-end pe-4">
        {adminUser ? (
          <div>
            <i className="bi bi-person-circle me-1"></i>
            {adminUser.name}
          </div>
        ) : (
          ""
        )}
      </td>
    </tr>
  );
};

export default Header;

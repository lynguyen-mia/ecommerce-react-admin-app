import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { getVariable } from "../utils/getLocalVar";
import Navbar from "./NavBar";
import Header from "./Header";

const RootLayout = () => {
  // Get current logged-in user
  const adminUser = getVariable("adminUser");

  // Check user expiration
  useEffect(() => {
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
  }, [adminUser]);

  return (
    <div className="container-fluid mt-3">
      <table
        className="table"
        style={{ height: "100vh", backgroundColor: "transparent !important" }}
      >
        <tbody>
          <Header />

          <tr className="row h-100">
            <td className="col col-2 border-2 border-top-0 border-bottom-0 pt-4 d-flex flex-column align-items-center gap-3">
              <Navbar />
            </td>
            <td className="col col-10">
              {!adminUser ? (
                <div className="text-center mt-4 fs-5">
                  <i className="bi bi-x-circle-fill"></i> Session timed out!
                  <div>Please log in to see to admin's dashboads.</div>
                </div>
              ) : (
                <Outlet />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RootLayout;

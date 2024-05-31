import Navbar from "../components/NavBar";
import Header from "../components/Header";
import { getVariable } from "../utils/getLocalVar";

const ErrorPage = () => {
  const adminUser = getVariable("adminUser");

  return (
    <div>
      <div className="container-fluid mt-3">
        <table
          className="table"
          style={{ height: "100vh", backgroundColor: "transparent !important" }}
        >
          <tbody>
            <Header />

            <tr className="row h-100">
              <td className="col col-2 border-2 border-top-0 border-bottom-0 pt-4 d-flex flex-column align-items-center gap-3">
                {/* Menu items here */}
                <Navbar />
              </td>
              <td className="col col-10">
                {!adminUser ? (
                  <div className="text-center mt-4 fs-5">
                    <i className="bi bi-x-circle-fill"></i> Session timed out!
                    <div>Please log in to see to admin's dashboads.</div>
                  </div>
                ) : (
                  <h3 className="text-center my-5">Page Not Found.</h3>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ErrorPage;

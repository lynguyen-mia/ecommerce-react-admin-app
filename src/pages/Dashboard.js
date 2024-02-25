import { useLoaderData, redirect, Link } from "react-router-dom";
import { getVariable } from "../utils/getLocalVar";
import convertToVND from "../utils/convertToVND";

const Dashboard = () => {
  const adminUser = getVariable("adminUser");
  const dashboard = useLoaderData();
  // console.log(dashboard);
  return (
    <>
      {!adminUser && (
        <div className="text-center mt-4 fs-5">
          <i className="bi bi-x-circle-fill"></i> Session timed out!
          <div>Please log in to see to admin's dashboads.</div>
        </div>
      )}
      {adminUser && adminUser.role === "admin" && (
        <div className="container">
          {/* Info board */}
          <div className="d-flex gap-3 mt-2 mb-4">
            <div className="card card-body shadow-sm bg-body py-3 d-flex flex-row justify-content-between align-items-center">
              <div>
                <div className="fs-4 mb-1 dashboard-statistics">
                  {dashboard.clients}
                </div>
                <div className="text-secondary">Clients</div>
              </div>
              <i className="bi bi-person pe-2 fs-5"></i>
            </div>

            <div className="card card-body shadow-sm bg-body py-3 d-flex flex-row justify-content-between align-items-center">
              <div>
                <div className="fs-4 mb-1 dashboard-statistics">
                  {convertToVND(dashboard.monthEarning?.toFixed(0))}
                </div>
                <div className="text-secondary">Earnings of month</div>
              </div>
              <i className="bi bi-wallet pe-2"></i>
            </div>

            <div className="card card-body shadow-sm bg-body py-3 d-flex flex-row justify-content-between align-items-center">
              <div>
                <div className="fs-4 mb-1 dashboard-statistics">
                  {dashboard.orders}
                </div>
                <div className="text-secondary">Total Orders</div>
              </div>
              <i className="bi bi-cart3 pe-2"></i>
            </div>

            <div className="card card-body shadow-sm bg-body py-3 d-flex flex-row justify-content-between align-items-center">
              <div>
                <div className="fs-4 mb-1 dashboard-statistics">
                  {convertToVND(dashboard.earning)}
                </div>
                <div className="text-secondary">Total Earnings</div>
              </div>
              <i className="bi bi-coin pe-2"></i>
            </div>
          </div>

          {/* Latest orders */}
          <div className="card card-body shadow-sm py-4 bg-body">
            <h2 className="fs-5 fw-normal">Latest orders</h2>
            <div className="table-responsive">
              {dashboard && dashboard.latestOrders?.length === 0 && (
                <p className="text-center fs-6">No order found.</p>
              )}
              {dashboard && dashboard.latestOrders?.length > 0 && (
                <table className="table table-bordered table-striped align-middle pb-4 mt-2">
                  <caption className="pt-4 text-end">
                    1-{dashboard.latestOrders?.length} of{" "}
                    {dashboard.latestOrders?.length}
                  </caption>
                  <thead>
                    <tr>
                      <th>ID User</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Total</th>
                      <th>Delivery</th>
                      <th>Status</th>
                      <th>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.latestOrders.map((o) => {
                      return (
                        <tr key={o._id}>
                          <td>{o.user.userId}</td>
                          <td>{o.user.name}</td>
                          <td>{o.user.phone}</td>
                          <td>{o.user.address}</td>
                          <td>
                            {o.total.toLocaleString("en-US").replace(/,/g, ".")}
                          </td>
                          <td>{o.delivery}</td>
                          <td>{o.status}</td>
                          <td>
                            <Link
                              to={`/order/${o._id}`}
                              className="btn btn-sm btn-success"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
      {adminUser && adminUser.role !== "admin" && (
        <div className="text-center mt-5 fs-4">Restricted view</div>
      )}
    </>
  );
};

export default Dashboard;

export async function loader() {
  // Authentication
  const adminUser = getVariable("adminUser");
  if (!adminUser) {
    return redirect("/auth");
  }

  // Fetch all products
  const res = await fetch(
    "https://ecommerce-node-app-sfau.onrender.com/admin/dashboard",
    {
      credentials: "include"
    }
  );

  // if (res.status === 401) {
  //   window.alert("Your session has expired, please log in again");
  //   return window.location.replace("/auth");
  // }

  if (!res.ok) {
    console.log("Couldn't fetch dashboards");
  }
  const dashboard = await res.json();
  return dashboard;
}

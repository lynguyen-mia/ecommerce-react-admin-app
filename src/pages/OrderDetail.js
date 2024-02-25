import { redirect, useLoaderData } from "react-router-dom";
import convertToVND from "../utils/convertToVND";
import { getVariable } from "../utils/getLocalVar";

const adminUser = getVariable("adminUser");

const OrderDetail = () => {
  const order = useLoaderData();
  return (
    <div
      id="order-detail"
      className="container"
      style={{ maxWidth: "1140px", marginBottom: "100px" }}
    >
      <h1 className="fs-3 mt-3">
        <strong className="fs-4">INFORMATION ORDER</strong>
      </h1>
      <div className="user-detail my-3">
        <div>Order Id: {order._id}</div>
        <div>User Id: {order.user.userId}</div>
        <div>Full Name: {order.user.name}</div>
        <div>Phone: {order.user.phone}</div>
        <div>Address: {order.user.address}</div>
        <div>
          Total: <strong>{convertToVND(order.total)}</strong>
        </div>
      </div>

      {/* Order detail table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-center mt-3 w-100">
          <thead>
            <tr className="row-cols-5">
              <td
                className="col-3 text-break fw-bold"
                style={{ minWidth: "120px" }}
              >
                ID PRODUCT
              </td>
              <td className="col-2 fw-bold">IMAGE</td>
              <td className="col-3 fw-bold" style={{ minWidth: "120px" }}>
                NAME
              </td>
              <td className="col-2 fw-bold">PRICE</td>
              <td className="col-2 fw-bold">COUNT</td>
            </tr>
          </thead>
          <tbody>
            {order.items.map((p) => (
              <tr key={p._id} className="row-cols-5">
                <td className="col-3 text-break" style={{ minWidth: "120px" }}>
                  {p.product._id}
                </td>
                <td className="col-2">
                  <img
                    src={
                      p.product.img1.includes("public/images")
                        ? `/${p.product.img1}`
                        : p.product.img1
                    }
                    alt={p.product.name}
                    style={{ width: "150px", height: "auto" }}
                  />
                </td>
                <td className="col-3" style={{ minWidth: "120px" }}>
                  {p.product.name}
                </td>
                <td className="col-2">{convertToVND(p.product.price)}</td>
                <td className="col-2">{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default OrderDetail;

export async function loader({ request, params }) {
  // Authentication
  if (!adminUser) {
    return redirect("/auth");
  }

  const orderId = params.orderId;
  const res = await fetch(
    `https://ecommerce-node-app-sfau.onrender.com/admin/order?id=${orderId}`,
    {
      credentials: "include"
    }
  );
  if (res.status === 401) {
    window.alert("Your session has expired, please log in again");
    return window.location.replace("/auth");
  }
  if (!res.ok) {
    console.log("Can't fetch order detail");
  }
  const result = await res.json();
  return result.data;
}

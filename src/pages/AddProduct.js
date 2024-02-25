import { redirect } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { getVariable } from "../utils/getLocalVar";
const adminUser = getVariable("adminUser");

const AddProduct = (props) => {
  return (
    <div className="container">
      <div className="card card-body shadow-sm bg-body mb-3">
        <h2 className="fs-5 fw-normal">Add A New Product</h2>
      </div>
      <ProductForm editing={false} />
    </div>
  );
};

export default AddProduct;

export async function loader() {
  // Authentication
  if (!adminUser) {
    return redirect("/auth");
  }
  return null;
}

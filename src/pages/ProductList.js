import { useState, useEffect, useRef } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import Loader from "../components/Loader";
import { getVariable } from "../utils/getLocalVar";

const adminUser = getVariable("adminUser");

const ProductList = () => {
  const products = useLoaderData();
  const searchRef = useRef();
  const [productArr, setProductArr] = useState([]);
  const [editProduct, setEditProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProductArr(products);
    setIsLoading(false);
  }, [products]);

  async function onSearch(e) {
    try {
      if (e.key === "Enter") {
        const searchTerms = searchRef.current.value;
        const res = await fetch(
          `https://ecommerce-node-app-sfau.onrender.com/admin/search-product/?search=${searchTerms}`,
          {
            credentials: "include"
          }
        );
        if (res.status === 401) {
          window.alert("Your session has expired, please log in again");
          return window.location.replace("/auth");
        }
        const result = await res.json();
        setProductArr(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function onDeleteProduct(e, prodId) {
    e.preventDefault();
    const confirm = window.confirm("Do you want to delete this product?");
    if (confirm) {
      const res = await fetch(
        `https://ecommerce-node-app-sfau.onrender.com/admin/delete-product/${prodId}`,
        {
          credentials: "include"
        }
      );

      if (res.status === 401) {
        window.alert("Your session has expired, please log in again");
        return window.location.replace("/auth");
      }
      if (!res.ok) {
        return window.alert("Couldn't delete the product.");
      }

      // Delete product from DOM
      const btn = e.target;
      const rowToBeDeleted = btn.closest("tr");
      rowToBeDeleted.parentNode.removeChild(rowToBeDeleted);
    } else {
      return;
    }
  }

  async function onEditProduct(e, prodId) {
    e.preventDefault();
    const res = await fetch(
      `https://ecommerce-node-app-sfau.onrender.com/admin/fetch/${prodId}`,
      {
        credentials: "include"
      }
    );

    if (res.status === 401) {
      window.alert("Your session has expired, please log in again");
      return window.location.replace("/auth");
    }
    if (res.status === 500) {
      console.log("Couldn't fetch the product");
    }
    const editProduct = await res.json();
    setEditProduct(editProduct.data);
  }

  return (
    <div className="container">
      <div className="shadow-sm pb-4 pt-3">
        <h2 className="fs-5 fw-normal">Products</h2>
        <input
          type="text"
          name="search"
          className="form-control w-25"
          placeholder="Enter search"
          ref={searchRef}
          onKeyDown={onSearch}
        />

        <div className="admin-table table-responsive mt-3">
          {isLoading && (
            <div className="text-center mt-2">
              <Loader />
            </div>
          )}
          {!isLoading && productArr && productArr.length === 0 && (
            <p className="text-center fs-6">No product found.</p>
          )}
          {productArr && productArr.length > 0 && (
            <table
              className="table table-striped table-bordered align-middle pb-4"
              style={{ height: "fit-content" }}
            >
              <caption className="pt-4 text-end">
                Total {productArr.length} products
              </caption>
              <thead>
                <tr>
                  <th className="text-break" style={{ minWidth: "120px" }}>
                    ID
                  </th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {productArr.map((p) => {
                  return (
                    <tr key={p._id}>
                      <td className="text-break" style={{ minWidth: "120px" }}>
                        {p._id}
                      </td>
                      <td>{p.name}</td>
                      <td>
                        {p.price.toLocaleString("en-US").replace(/,/g, ".")}
                      </td>
                      <td>
                        <img
                          src={p.img1}
                          alt={p.name}
                          style={{ width: "50px", height: "auto" }}
                        />
                      </td>
                      <td>{p.category}</td>
                      <td className="d-flex align-items-center gap-2 h-100">
                        <button
                          className="btn btn-sm btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#productEdit"
                          onClick={(e) => onEditProduct(e, p._id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => onDeleteProduct(e, p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Product Editing modal */}
      <div
        className="modal fade"
        id="productEdit"
        tabIndex="-1"
        aria-labelledby="productEdit"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Product</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ProductForm editing={true} editProduct={editProduct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;

export async function loader() {
  // Authentication
  if (!adminUser) {
    return redirect("/auth");
  }

  // Fetch all products
  const res = await fetch(
    "https://ecommerce-node-app-sfau.onrender.com/admin/fetch-products",
    {
      credentials: "include"
    }
  );

  if (!res.ok) {
    console.log("Couldn't fetch products");
  }
  const products = await res.json();
  return products.data;
}

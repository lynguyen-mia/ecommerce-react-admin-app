import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductForm = ({ editing, editProduct }) => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const categoryRef = useRef();
  const shortDescriptionRef = useRef();
  const longDescriptionRef = useRef();
  const priceRef = useRef();
  const inStockRef = useRef();
  const fileRef = useRef();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [error, setError] = useState({});

  useEffect(() => {
    setError({});
    if (editing && Object.keys(editProduct).length > 0) {
      nameRef.current.value = editProduct.name;
      categoryRef.current.value = editProduct.category;
      shortDescriptionRef.current.value = editProduct.short_desc;
      longDescriptionRef.current.value = editProduct.long_desc;
      priceRef.current.value = editProduct.price;
      inStockRef.current.value = editProduct.in_stock;
    }
  }, [editing, editProduct]);

  function onUploadFiles(e) {
    if (e.target.files.length !== 4) {
      return window.alert("Please upload 4 images for this product");
    }
    setUploadedFiles(e.target.files);
  }

  function resetForm() {
    nameRef.current.value = "";
    categoryRef.current.value = "";
    shortDescriptionRef.current.value = "";
    longDescriptionRef.current.value = "";
    setUploadedFiles([]);
    fileRef.current.value = "";
    priceRef.current.value = "";
    inStockRef.current.value = "";
    setError({});
  }

  async function onAddProduct(e) {
    try {
      e.preventDefault();
      const name = nameRef.current.value.trim();
      const category = categoryRef.current.value.trim();
      const shortDescription = shortDescriptionRef.current.value.trim();
      const longDescription = longDescriptionRef.current.value.trim();
      const price = priceRef.current.value.trim();
      const inStock = inStockRef.current.value.trim();

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("shortDescription", shortDescription);
      formData.append("longDescription", longDescription);
      formData.append("price", price);
      formData.append("inStock", inStock);
      for (const img of uploadedFiles) {
        formData.append("images", img);
      }

      let url =
        "https://ecommerce-node-app-sfau.onrender.com/admin/add-product";
      let method = "POST";
      if (editing) {
        url = `https://ecommerce-node-app-sfau.onrender.com/admin/edit/${editProduct._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method: method,
        credentials: "include",
        body: formData
      });

      if (res.status === 401) {
        window.alert("Your session has expired, please log in again");
        return window.location.replace("/auth");
      }
      if (!res.ok || res.status === 500) {
        const error = await res.json();
        return setError(error);
      } else {
        if (method === "PUT") {
          // Close edit modal programmatically
          const closeBtn = document.getElementById("closeEditModal");
          closeBtn.click();
          return navigate("/products");
        }
        resetForm();
        window.alert("Product added.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form>
      <div className="card card-body shadow-sm py-4 bg-body">
        {error && (
          <div className="text-center text-danger my-2">{error.msg}</div>
        )}

        <div className="row gy-4 gx-5">
          <div>
            <label htmlFor="name" className="form-label">
              Product Name*
            </label>
            <input
              type="text"
              className="form-control border-0 border-bottom"
              id="name"
              name="name"
              placeholder="Enter Product Name"
              ref={nameRef}
            />
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Category*
            </label>
            <input
              type="text"
              className="form-control border-0 border-bottom"
              id="category"
              name="category"
              placeholder="Enter Category"
              ref={categoryRef}
            />
          </div>

          <div>
            <label htmlFor="short-description" className="form-label">
              Short Description*
            </label>
            <input
              type="text"
              className="form-control border-0 border-bottom"
              id="short-description"
              name="short-description"
              placeholder="Enter short description"
              ref={shortDescriptionRef}
            />
          </div>

          <div>
            <label htmlFor="long-description" className="form-label">
              Long Description*
            </label>
            <input
              type="text"
              className="form-control border-0 border-bottom"
              id="long-description"
              name="long-description"
              placeholder="Enter Long Description"
              ref={longDescriptionRef}
            />
          </div>

          <div>
            <label htmlFor="price" className="form-label">
              Price*
            </label>
            <input
              type="number"
              className="form-control border-0 border-bottom"
              id="price"
              name="price"
              placeholder="Enter price"
              ref={priceRef}
            />
          </div>

          <div>
            <label htmlFor="instock" className="form-label">
              In stock*
            </label>
            <input
              type="number"
              className="form-control border-0 border-bottom"
              id="instock"
              name="stock"
              placeholder="Number in stock"
              ref={inStockRef}
            />
          </div>

          <div>
            <label htmlFor="images" className="form-label">
              Upload Images* (Please upload 4 images)
            </label>
            <input
              type="file"
              className="form-control"
              multiple
              id="images"
              name="images"
              onChange={onUploadFiles}
              ref={fileRef}
            />
          </div>

          <div>
            <button
              className="btn btn-success px-5 mt-3"
              onClick={(e) => onAddProduct(e)}
            >
              Submit
            </button>
            <button
              hidden
              id="closeEditModal"
              data-bs-dismiss="modal"
              onClick={(e) => e.preventDefault()}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;

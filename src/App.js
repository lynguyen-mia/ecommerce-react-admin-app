import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Auth from "./auth/Auth";
import ProductList, { loader as productLoader } from "./pages/ProductList";
import Dashboard, { loader as dashboardLoader } from "./pages/Dashboard";
import OrderDetail, { loader as orderDetailLoader } from "./pages/OrderDetail";
import AddProduct, { loader as addProductLoader } from "./pages/AddProduct";
import LiveChat, { loader as chatLoader } from "./pages/LiveChat";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard />, loader: dashboardLoader },
      { path: "/products", element: <ProductList />, loader: productLoader },
      {
        path: "/order/:orderId",
        element: <OrderDetail />,
        loader: orderDetailLoader
      },
      {
        path: "/add-product",
        element: <AddProduct />,
        loader: addProductLoader
      }
    ]
  },
  { path: "/auth", element: <Auth /> },
  { path: "/livechat", element: <LiveChat />, loader: chatLoader }
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;

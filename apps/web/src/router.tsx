
import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "./pages/home";
import CreateWorkshop from "./pages/CreateWorkshop";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', Component: Home },
      { path: '/create', Component: CreateWorkshop }
    ]
  }
])

export default router

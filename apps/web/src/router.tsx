
import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "./pages/Home";
import CreateWorkshop from "./pages/CreateWorkshop";

const setDocumentTitle = (title: string) =>
  document.title = `Secret Santa - ${title}`

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', Component: Home, loader: () => setDocumentTitle('Home')},
      { path: '/create', Component: CreateWorkshop, loader: () => setDocumentTitle('Create Workshop') }
    ]
  }
])

export default router

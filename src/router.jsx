import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./views/Home/Home";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home/>,
        },

    ])
    return router;
}

export default Router
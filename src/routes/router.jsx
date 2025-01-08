import { createBrowserRouter } from "react-router-dom";
import Main from "../components/layout/Main";
import Home from "../pages/Home";
import ImagePage from "../pages/ImagePage";

export const routes = createBrowserRouter([
    {
        path:"/",
        element:<Main/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/uploadLogo",
                element:<ImagePage/>
            }
        ]
    }
])
import {createBrowserRouter} from "react-router-dom";
import App from "../App.tsx";
// import { SignUpForm } from "../features/authentication/SignUpForm/SignUpForm.tsx";
export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    // { path: "/projects", element: <ProjectPage /> },
    // { path: "/register", element: <SignUpForm /> },
]);
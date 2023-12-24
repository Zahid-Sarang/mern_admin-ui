import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/login";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Dashboard />,
		children: [
			{
				path: "",
				element: <HomePage />,
			},
		],
	},
	{
		path: "/auth",
		element: <NonAuth />,
		children: [
			{
				path: "login",
				element: <LoginPage />,
			},
		],
	},
]);

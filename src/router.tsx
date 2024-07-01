import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/login/Login";
import TenantsPage from "./pages/tenants/Tenants";
import UsersPage from "./pages/users/Users";
import Products from "./pages/products/Products";
import Orders from "./pages/orders/Orders";
import SingleOrder from "./pages/orders/SingleOrder";
import Toppings from "./pages/toppings/Toppings";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <Dashboard />,
				children: [
					{
						path: "",
						element: <HomePage />,
					},
					{
						path: "/users",
						element: <UsersPage />,
					},
					{
						path: "/restaurants",
						element: <TenantsPage />,
					},
					{
						path: "/products",
						element: <Products />,
					},
					{
						path: "/orders",
						element: <Orders />,
					},
					{
						path: "/orders/:orderId",
						element: <SingleOrder />,
					},
					{
						path: "/toppings",
						element: <Toppings />,
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
		],
	},
]);

import { useState } from "react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import Icon, { BellFilled } from "@ant-design/icons";

import { useAuthStore } from "../store";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/UserIcon";
import { foodIcon } from "../components/icons/FoodIcon";
import ToppingIcon from "../components/icons/ToppingIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
import CategoryIcon from "../components/icons/CategoryIcon";

const { Sider, Header, Content, Footer } = Layout;

const menuItemsConfig = [
	{
		key: "/",
		icon: <Icon component={Home} />,
		label: <NavLink to="/">Home</NavLink>,
	},
	{
		key: "/users",
		icon: <Icon component={UserIcon} />,
		label: <NavLink to="/users">Users</NavLink>,
		roles: ["admin"],
	},
	{
		key: "/restaurants",
		icon: <Icon component={foodIcon} />,
		label: <NavLink to="/restaurants">Restaurants</NavLink>,
		roles: ["admin"],
	},
	{
		key: "/order",
		icon: <Icon component={BasketIcon} />,
		label: <NavLink to="/orders">Orders</NavLink>,
	},
	{
		key: "/products",
		icon: <Icon component={foodIcon} />,
		label: <NavLink to="/products">Products</NavLink>,
	},
	{
		key: "/category",
		icon: <Icon component={CategoryIcon} />,
		label: <NavLink to="/products">Category</NavLink>,
		roles: ["admin"],
	},
	{
		key: "/toppings",
		icon: <Icon component={ToppingIcon} />,
		label: <NavLink to="/toppings">Toppings</NavLink>,
	},
	{
		key: "/promos",
		icon: <Icon component={GiftIcon} />,
		label: <NavLink to="/promos">Promos</NavLink>,
	},
];

const getMenuItems = (role: string) => {
	const filteredMenuItems = menuItemsConfig.filter((item) => {
		return !item.roles || item.roles.includes(role);
	});

	return filteredMenuItems;
};

const Dashboard = () => {
	const location = useLocation();
	const [collapsed, setCollapsed] = useState(false);
	const { user, logout: logoutFromStore } = useAuthStore();
	const { mutate: logoutMutate } = useMutation({
		mutationKey: ["logout"],
		mutationFn: logout,
		onSuccess: async () => {
			logoutFromStore();
			return;
		},
	});
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	if (user === null) {
		return <Navigate to={`/auth/login?returnTo=${location.pathname}`} replace={true} />;
	}

	const items = getMenuItems(user.role);
	return (
		<div>
			<Layout style={{ minHeight: "100vh", background: colorBgContainer }}>
				<Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
					<div className="logo">
						<Logo />
					</div>
					<Menu theme="light" defaultSelectedKeys={[`${location.pathname}`]} mode="inline" items={items} />
				</Sider>
				<Layout>
					<Header
						style={{
							paddingLeft: "16px",
							paddingRight: "16px",
							background: colorBgContainer,
						}}
					>
						<Flex gap="middle" align="start" justify="space-between">
							<Badge text={user.role === "admin" ? "You are an admin" : user.tenant?.name} status="success" />
							<Space size={16}>
								<Badge dot={true}>
									<BellFilled />
								</Badge>
								<Dropdown
									menu={{
										items: [
											{
												key: "logout",
												label: "Logout",
												onClick: () => logoutMutate(),
											},
										],
									}}
									placement="bottomRight"
								>
									<Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>U</Avatar>
								</Dropdown>
							</Space>
						</Flex>
					</Header>
					<Content style={{ margin: "24px" }}>
						<Outlet />
					</Content>
					<Footer style={{ textAlign: "center" }}>PizzaRoma Pizza Shop</Footer>
				</Layout>
			</Layout>
		</div>
	);
};

export default Dashboard;

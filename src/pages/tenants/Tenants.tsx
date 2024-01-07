import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";

import TenantsFilter from "./TenantFilter";

import { useState } from "react";
import { useAuthStore } from "../../store";

const columns = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
	},
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "Address",
		dataIndex: "address",
		key: "email",
	},
	{
		title: "Manager",
		dataIndex: "manger",
		key: "manger",
	},
];

const Tenants = () => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user } = useAuthStore();
	if (user?.role === "manager") {
		return <Navigate to="/" replace={true} />;
	}
	const {
		data: users,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["tenants"],
		queryFn: () => {
			return getTenants().then((res) => res.data);
		},
	});

	return (
		<>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				<Breadcrumb
					separator={<RightOutlined />}
					items={[
						{
							title: <Link to="/">Dashboard</Link>,
						},
						{
							title: "Restaurants",
						},
					]}
				/>
				{isLoading && <div>Loading...</div>}
				{isError && <div>{error.message}</div>}
				<TenantsFilter
					onFilterChange={(filterName: string, filterValue: string) => {
						console.log(filterName, filterValue);
					}}
				>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setDrawerOpen(true)}
					>
						Create Restaurants
					</Button>
				</TenantsFilter>

				<Table columns={columns} dataSource={users} rowKey={"id"} />

				{/* Drawer */}
				<Drawer
					title="Create Tenants"
					open={drawerOpen}
					width={720}
					destroyOnClose={true}
					onClose={() => {
						setDrawerOpen(false);
					}}
					extra={
						<Space>
							<Button>Cancel</Button>
							<Button type="primary">Save</Button>
						</Space>
					}
				></Drawer>
			</Space>
		</>
	);
};

export default Tenants;

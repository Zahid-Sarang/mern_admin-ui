import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useState } from "react";

const columns = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
	},
	{
		title: "Name",
		dataIndex: "firstName",
		key: "firstName",
		render: (_text: string, record: User) => {
			return (
				<div>
					{record.firstName} {record.lastName}
				</div>
			);
		},
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
	},
	{
		title: "Role",
		dataIndex: "role",
		key: "role",
	},
];

const Users = () => {
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
		queryKey: ["users"],
		queryFn: () => {
			return getUsers().then((res) => res.data);
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
							title: "Users",
						},
					]}
				/>
				{isLoading && <div>Loading...</div>}
				{isError && <div>{error.message}</div>}
				<UsersFilter
					onFilterChange={(filterName: string, filterValue: string) => {
						console.log(filterName, filterValue);
					}}
				>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => setDrawerOpen(true)}
					>
						Add User
					</Button>
				</UsersFilter>
				<Table columns={columns} dataSource={users} rowKey={"id"} />

				{/* Drawer */}
				<Drawer
					title="Create user"
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

export default Users;

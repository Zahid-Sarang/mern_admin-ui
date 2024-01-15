import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";

import TenantsFilter from "./TenantFilter";

import { useState } from "react";
import { useAuthStore } from "../../store";
import TenantForm from "./forms/TenantForms";
import { Tenant } from "../../types";

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
		key: "address",
	},
];

const Tenants = () => {
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user } = useAuthStore();
	if (user?.role === "manager") {
		return <Navigate to="/" replace={true} />;
	}
	const {
		data: tenants,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["tenants"],
		queryFn: async () => {
			const res = await getTenants();
			return res.data;
		},
	});

	const { mutate: tenantMutate } = useMutation({
		mutationKey: ["user"],
		mutationFn: async (data: Tenant) =>
			createTenant(data).then((res) => res.data),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["tenants"] });
			return;
		},
	});

	const onHandleSubmit = async () => {
		await form.validateFields();
		tenantMutate(form.getFieldsValue());
		form.resetFields();
		setDrawerOpen(false);
	};

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

				<Table columns={columns} dataSource={tenants} rowKey={"id"} />

				{/* Drawer */}
				<Drawer
					title="Create Tenants"
					open={drawerOpen}
					width={720}
					styles={{ body: { background: colorBgLayout } }}
					destroyOnClose={true}
					onClose={() => {
						form.resetFields();
						setDrawerOpen(false);
					}}
					extra={
						<Space>
							<Button
								onClick={() => {
									form.resetFields();
									setDrawerOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button type="primary" onClick={onHandleSubmit}>
								Save
							</Button>
						</Space>
					}
				>
					<Form layout="vertical" form={form}>
						<TenantForm />
					</Form>
				</Drawer>
			</Space>
		</>
	);
};

export default Tenants;

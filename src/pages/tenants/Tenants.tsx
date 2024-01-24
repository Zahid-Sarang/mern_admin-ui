import {
	Breadcrumb,
	Button,
	Drawer,
	Flex,
	Form,
	Space,
	Spin,
	Table,
	theme,
	Typography,
} from "antd";
import {
	RightOutlined,
	PlusOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createTenant, getTenants } from "../../http/api";

import TenantsFilter from "./TenantFilter";

import { useMemo, useState } from "react";
import { useAuthStore } from "../../store";
import TenantForm from "./forms/TenantForms";
import { FiledData, Tenant } from "../../types";
import { TENANT_PER_PAGE } from "../../constants";
import { debounce } from "lodash";

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
	const [form] = Form.useForm();
	const [filterForm] = Form.useForm();
	const [queryParams, setQueryParams] = useState({
		perPage: TENANT_PER_PAGE,
		currentPage: 1,
	});
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const queryClient = useQueryClient();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user } = useAuthStore();
	if (user?.role === "manager") {
		return <Navigate to="/" replace={true} />;
	}
	const {
		data: tenants,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["tenants", queryParams],
		queryFn: () => {
			const filterParams = Object.fromEntries(
				Object.entries(queryParams).filter((item) => !!item[1])
			);

			const queryString = new URLSearchParams(
				filterParams as unknown as Record<string, string>
			).toString();
			return getTenants(queryString).then((res) => res.data);
		},
		placeholderData: keepPreviousData,
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

	// debouncing
	const debouncedQUpdate = useMemo(() => {
		return debounce((value: string | undefined) => {
			setQueryParams((prev) => ({ ...prev, q: value }));
		}, 1000);
	}, []);

	// filter Function
	const onFilterChange = (changedFields: FiledData[]) => {
		console.log(changedFields);
		const changedFilterFields = changedFields
			.map((item) => ({
				[item.name[0]]: item.value,
			}))
			.reduce((acc, item) => ({ ...acc, ...item }), {});
		if ("q" in changedFilterFields) {
			debouncedQUpdate(changedFilterFields.q);
		} else {
			setQueryParams((prev) => ({
				...prev,
				...changedFilterFields,
			}));
		}
	};

	return (
		<>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				<Flex justify="space-between">
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
					{isFetching && (
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
						/>
					)}
					{isError && (
						<Typography.Text type="danger">{error.message}</Typography.Text>
					)}
				</Flex>
				<Form form={filterForm} onFieldsChange={onFilterChange}>
					<TenantsFilter>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => setDrawerOpen(true)}
						>
							Create Restaurants
						</Button>
					</TenantsFilter>
				</Form>

				<Table
					columns={columns}
					dataSource={tenants?.data}
					rowKey={"id"}
					pagination={{
						total: tenants?.total,
						pageSize: queryParams.perPage,
						current: queryParams.currentPage,
						onChange: (page, pageSize) => {
							setQueryParams((prev) => {
								return {
									...prev,
									currentPage: page,
								};
							});
						},
					}}
				/>

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

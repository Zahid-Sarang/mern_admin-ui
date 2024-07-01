import { Breadcrumb, Button, Flex, Form, Space, Typography, Image, Spin, Table, Drawer, theme } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ToppingFilter from "./ToppingFilter";
import { Topping } from "../../types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTopping, getToppings } from "../../http/api";
import React from "react";
import { TOPPING_PER_PAGE } from "../../constants";
import { useAuthStore } from "../../store";
import ToppingForm from "./forms/ToppingForm";
import { makeFormData } from "../products/helpers";

/**
 * name & image
 * price
 * tenantId
 */

const columns = [
	{
		title: "Topping Name",
		dataIndex: "name",
		key: "name",
		render: (_text: string, record: Topping) => {
			return (
				<Space>
					<Image width={60} src={record.image} />
					<Typography.Text>{record.name}</Typography.Text>
				</Space>
			);
		},
	},
	{
		title: "Price",
		dataIndex: "price",
		key: "price",
		render: (_text: string, record: Topping) => {
			return <Typography.Text>₹{record.price}</Typography.Text>;
		},
	},
];

const Toppings = () => {
	const [form] = Form.useForm();
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const { user } = useAuthStore();
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const [queryParams, setQueryParams] = React.useState({
		perPage: TOPPING_PER_PAGE,
		currentPage: 1,
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});

	// Fetching Toppings Data
	const {
		data: toppings,
		isFetching,
		isError,
		error,
		isLoading,
	} = useQuery({
		queryKey: ["toppings", queryParams],
		queryFn: async () => {
			const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));

			const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();

			return await getToppings(queryString).then((res) => res.data);
		},
		placeholderData: keepPreviousData,
	});

	const queryClient = useQueryClient();

	const { mutate: toppingMutate, isPending: isCreateToppingsPendding } = useMutation({
		mutationKey: ["createToppings"],
		mutationFn: async (data: FormData) => {
			return await createTopping(data).then((res) => res.data);
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			form.resetFields();
			setDrawerOpen(false);
			return;
		},
	});

	if (isLoading) {
		return <h1>Loading.....</h1>;
	}

	const handleDeleteTopping = (toppingId: string) => {
		console.log("toppingId: " + toppingId);
	};

	// Handle form data
	const onHandleSubmit = async () => {
		await form.validateFields();

		const postData = {
			...form.getFieldsValue(),
			tenantId: user?.role === "manager" ? user.tenant?.id : form.getFieldValue("tenantId"),
			image: form.getFieldValue("image"),
		};

		const formData = makeFormData(postData);
		await toppingMutate(formData);
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
								title: "Toppings",
							},
						]}
					/>
					{isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
					{isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
				</Flex>
				<Form>
					<ToppingFilter>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
							Add Topping
						</Button>
					</ToppingFilter>
				</Form>

				{/* Table */}
				<Table
					columns={[
						...columns,
						{
							title: "Actions",
							render: (_, record: Topping) => {
								return (
									<Space>
										<Button
											type="link"
											onClick={() => {
												handleDeleteTopping(record._id);
											}}
										>
											<DeleteOutlined />
											Delete
										</Button>
									</Space>
								);
							},
						},
					]}
					dataSource={toppings.data}
					rowKey={"id"}
					pagination={{
						total: toppings.total,
						pageSize: queryParams.perPage,
						current: queryParams.currentPage,
						onChange: (page) => {
							setQueryParams((prev) => {
								return {
									...prev,
									currentPage: page,
								};
							});
						},
						showTotal: (total: number, range: number[]) => {
							return `Showing ${range[0]} - ${range[1]} of ${total} items`;
						},
					}}
				/>

				{/* Drawer for create toppings */}
				<Drawer
					title="Add Toppings"
					open={drawerOpen}
					width={720}
					styles={{ body: { background: colorBgLayout } }}
					destroyOnClose={true}
					onClose={() => {
						setDrawerOpen(false);
					}}
					extra={
						<Space>
							<Button
								onClick={() => {
									setDrawerOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button type="primary" onClick={onHandleSubmit} loading={isCreateToppingsPendding}>
								Save
							</Button>
						</Space>
					}
				>
					<Form layout="vertical" form={form}>
						<ToppingForm form={form} />
					</Form>
				</Drawer>
			</Space>
		</>
	);
};

export default Toppings;

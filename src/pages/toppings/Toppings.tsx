import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { Breadcrumb, Button, Flex, Form, Space, Typography, Image, Spin, Table, Drawer, theme, Tag, Modal } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ToppingFilter from "./ToppingFilter";
import { FiledData, Topping } from "../../types";
import { createTopping, deleteTopping, getToppings, updateTopping } from "../../http/api";
import { TOPPING_PER_PAGE } from "../../constants";
import { useAuthStore } from "../../store";
import ToppingForm from "./forms/ToppingForm";
import { makeFormData } from "../products/helpers";

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
	{
		title: "Status",
		dataIndex: "isPublish",
		key: "isPublish",
		render: (_: boolean, record: Topping) => {
			return <>{record.isPublish ? <Tag color="green">Published</Tag> : <Tag color="red">Draft</Tag>}</>;
		},
	},
];

const Toppings = () => {
	const [form] = Form.useForm();
	const [filterForm] = Form.useForm();
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const { user } = useAuthStore();
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [currentTopping, setCurrentTopping] = React.useState<Topping | null>(null);
	const queryClient = useQueryClient();

	const [queryParams, setQueryParams] = React.useState({
		perPage: TOPPING_PER_PAGE,
		currentPage: 1,
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});
	const [open, setOpen] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [deleteToppingId, setDeleteToppingId] = React.useState<Topping | null>(null);

	// set Toppings for Edit

	useEffect(() => {
		if (currentTopping) {
			setDrawerOpen(true);
			form.setFieldsValue(currentTopping);
		}
	}, [currentTopping, form]);

	// Fetching Toppings Data
	const {
		data: toppings,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["toppings", queryParams],
		queryFn: async () => {
			const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
			const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();
			return await getToppings(queryString).then((res) => res.data);
		},
		placeholderData: keepPreviousData,
	});

	// Filter Toppings
	const debouncedQUpdate = React.useMemo(() => {
		return debounce((value: string | undefined) => {
			setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
		}, 500);
	}, []);

	const onFilterChange = (changeFields: FiledData[]) => {
		const changedFilterFields = changeFields
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
				currentPage: 1,
			}));
		}
	};

	const { mutate: toppingMutate, isPending: isCreateToppingsPendding } = useMutation({
		mutationKey: ["createToppings"],
		mutationFn: async (data: FormData) => {
			if (currentTopping) {
				return await updateTopping(data, currentTopping._id);
			} else {
				return await createTopping(data).then((res) => res.data);
			}
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["toppings"] });
			form.resetFields();
			setDrawerOpen(false);
			return;
		},
	});

	const { mutate: deleteToppingMutate, isPending } = useMutation({
		mutationKey: ["deleteToppings"],
		mutationFn: async (toppingId: string) => {
			return await deleteTopping(toppingId).then((res) => res.data);
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["toppings"] });
			return;
		},
	});

	// Delete Toppings
	const handleOk = () => {
		setConfirmLoading(isPending);
		if (deleteToppingId) {
			deleteToppingMutate(deleteToppingId._id);
		}
		setDeleteToppingId(null);
		setOpen(false);
	};
	const handleCancel = () => {
		setDeleteToppingId(null);
		setOpen(false);
	};
	const handleDeleteTopping = async (topping: Topping) => {
		setDeleteToppingId(topping);
		setOpen(true);
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
				<Form form={filterForm} onFieldsChange={onFilterChange}>
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
												setCurrentTopping(record);
											}}
										>
											<EditOutlined />
											Edit
										</Button>
										<Button
											type="link"
											onClick={() => {
												handleDeleteTopping(record);
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
					dataSource={toppings?.data}
					rowKey={"id"}
					pagination={{
						total: toppings?.total,
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
					title={currentTopping ? "Update Toppings" : "Add Toppings"}
					open={drawerOpen}
					width={720}
					styles={{ body: { background: colorBgLayout } }}
					destroyOnClose={true}
					onClose={() => {
						setCurrentTopping(null);
						form.resetFields();
						setDrawerOpen(false);
					}}
					extra={
						<Space>
							<Button
								onClick={() => {
									setCurrentTopping(null);
									form.resetFields();
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
			<Modal title="Delete" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<Space direction="vertical">
					<Typography.Text>Are sure you want to delete this topping ?</Typography.Text>
					<Typography.Text type="danger">Topping: {deleteToppingId?.name}</Typography.Text>
				</Space>
			</Modal>
		</>
	);
};

export default Toppings;

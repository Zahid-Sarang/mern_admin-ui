import { Breadcrumb, Button, Flex, Form, Space, Typography, Spin, Table, Drawer, theme, Modal, Tag } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { Coupon, FiledData } from "../../types";
import { Link } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import React from "react";
import { createCoupon, deleteCoupon, getCoupons } from "../../http/api";
import CouponFilter from "./CouponFilter";
import CouponForm from "./form/CouponForm";
import { COUPON_PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const columns = [
	{
		title: "Coupon Title",
		dataIndex: "title",
		key: "title",
	},
	{
		title: "Coupon Code",
		dataIndex: "code",
		key: "code",
	},
	{
		title: "Discount Percentage",
		dataIndex: "discount",
		key: "discount",
		render: (_text: string, record: Coupon) => {
			return <Typography.Text>{record.discount}%</Typography.Text>;
		},
	},
	{
		title: "Status",
		render: (_text: string, record: Coupon) => {
			const currentDate = new Date();
			const couponDate = new Date(record.validUpto);
			const isExpired = currentDate <= couponDate;
			return <>{isExpired ? <Tag color="green">Valid</Tag> : <Tag color="red">Expired</Tag>}</>;
		},
	},
	{
		title: "Valid Up To",
		dataIndex: "validUpto",
		key: "validUpto",
		render: (text: string) => {
			return <Typography.Text>{format(new Date(text), "dd/MM/yyy HH:mm")}</Typography.Text>;
		},
	},
];

const Coupons = () => {
	const [form] = Form.useForm();
	const [filterForm] = Form.useForm();

	const {
		token: { colorBgLayout },
	} = theme.useToken();

	const { user } = useAuthStore();
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [queryParams, setQueryParams] = React.useState({
		perPage: COUPON_PER_PAGE,
		currentPage: 1,
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});

	const [open, setOpen] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [deleteCouponId, setDeleteCouponId] = React.useState<Coupon | null>(null);
	const queryClient = useQueryClient();

	// Get Coupons
	const {
		data: coupons,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["coupons", queryParams],
		queryFn: async () => {
			const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
			const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();
			return await getCoupons(queryString).then((res) => res.data);
		},
		placeholderData: keepPreviousData,
	});

	const debounceQupdate = React.useMemo(() => {
		return debounce((value: string | undefined) => {
			setQueryParams((prev) => ({
				...prev,
				q: value,
				currentPage: 1,
			}));
		}, 500);
	}, []);

	// handle Filters

	const onFilterChange = (changeFields: FiledData[]) => {
		const changedFilterFields = changeFields
			.map((item) => ({
				[item.name[0]]: item.value,
			}))
			.reduce((acc, item) => ({ ...acc, ...item }), {});

		if ("q" in changedFilterFields) {
			debounceQupdate(changedFilterFields.q);
		} else {
			setQueryParams((prev) => ({
				...prev,
				...changedFilterFields,
				currentPage: 1,
			}));
		}
	};

	// create Coupon
	const { mutate: createCouponMutate, isPending: isCreateCouponPendding } = useMutation({
		mutationKey: ["createCoupon"],
		mutationFn: async (data: Coupon) => {
			return await createCoupon(data).then((res) => res.data);
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["coupons"] });
			form.resetFields();
			setDrawerOpen(false);
			return;
		},
	});

	// Delete Toppings
	const { mutate: deleteCouponMutate, isPending } = useMutation({
		mutationKey: ["deleteToppings"],
		mutationFn: async (toppingId: string) => {
			return await deleteCoupon(toppingId).then((res) => res.data);
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["coupons"] });
			return;
		},
	});

	const handleOk = () => {
		setConfirmLoading(isPending);
		if (deleteCouponId) {
			deleteCouponMutate(deleteCouponId._id);
		}
		setDeleteCouponId(null);
		setOpen(false);
	};
	const handleCancel = () => {
		setDeleteCouponId(null);
		setOpen(false);
	};
	const handleDeleteCoupon = async (coupon: Coupon) => {
		setDeleteCouponId(coupon);
		setOpen(true);
	};

	// Handle Form Data
	const onHandleSubmit = async () => {
		await form.validateFields();

		const postData = {
			...form.getFieldsValue(),
			tenantId: user?.role === "manager" ? user.tenant?.id : form.getFieldValue("tenantId"),
		};
		createCouponMutate(postData);
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
								title: "Coupons",
							},
						]}
					/>
					{isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
					{isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
				</Flex>
				<Form form={filterForm} onFieldsChange={onFilterChange}>
					<CouponFilter>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
							Add Coupon
						</Button>
					</CouponFilter>
				</Form>
				{/* Table */}
				<Table
					columns={[
						...columns,
						{
							title: "Actions",
							render: (_, record: Coupon) => {
								return (
									<Space>
										<Button
											type="link"
											onClick={() => {
												handleDeleteCoupon(record);
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
					dataSource={coupons?.data}
					rowKey={"id"}
					pagination={{
						total: coupons?.total,
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
					title={"Add Coupon"}
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
							<Button type="primary" onClick={onHandleSubmit} loading={isCreateCouponPendding}>
								Save
							</Button>
						</Space>
					}
				>
					<Form layout="vertical" form={form}>
						<CouponForm />
					</Form>
				</Drawer>
			</Space>
			<Modal title="Delete" open={open} onOk={handleOk} confirmLoading={confirmLoading} onCancel={handleCancel}>
				<Space direction="vertical">
					<Typography.Text>Are sure you want to delete this coupon ?</Typography.Text>
					<Typography.Text type="danger">Topping: {deleteCouponId?.title}</Typography.Text>
				</Space>
			</Modal>
		</>
	);
};

export default Coupons;

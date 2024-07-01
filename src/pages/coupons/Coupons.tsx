import { Breadcrumb, Button, Flex, Form, Space, Typography, Spin, Table, Drawer, theme, Tag, Modal } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { Coupon } from "../../types";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store";
import React from "react";
import { createCoupons, getCoupons } from "../../http/api";
import CouponFilter from "./CouponFilter";
import CouponForm from "./form/CouponForm";

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
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});
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
			return await getCoupons(queryString);
		},
	});

	// create Coupon

	const { mutate: createCoupon } = useMutation({
		mutationKey: ["createCoupon"],
		mutationFn: async (data: Coupon) => {
			return await createCoupons(data).then((res) => res.data);
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["coupons"] });
			form.resetFields();
			setDrawerOpen(false);
			return;
		},
	});

	// Handle Form Data
	const onHandleSubmit = async () => {
		await form.validateFields();

		const postData = {
			...form.getFieldsValue(),
			tenantId: user?.role === "manager" ? user.tenant?.id : form.getFieldValue("tenantId"),
		};
		createCoupon(postData);
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
				<Form form={filterForm}>
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
										<Button type="link" onClick={() => {}}>
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
							<Button type="primary" onClick={onHandleSubmit}>
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
		</>
	);
};

export default Coupons;

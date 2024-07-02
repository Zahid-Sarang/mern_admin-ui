import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Flex, Form, Space, Spin, Table, Tag, Typography, message } from "antd";
import { format } from "date-fns";
import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import { FiledData, Order, OrderEvents, PaymentMode, PaymentStatus } from "../../types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { ORDER_PER_PAGE, colorMapping } from "../../constants";
import { capitalizeFirst } from "../products/helpers";
import socket from "../../lib/socket";
import { useAuthStore } from "../../store";
import OrderFilterForm from "./form/OrderFilterForm";

const columns = [
	{
		title: "Order ID",
		dataIndex: "_id",
		key: "_id",
		render: (_text: string, record: Order) => {
			return <Typography.Text>{record._id}</Typography.Text>;
		},
	},
	{
		title: "Customer",
		dataIndex: "customerId",
		key: "customerId._id",
		render: (_text: string, record: Order) => {
			if (!record.customerId) return "";
			return <Typography.Text>{record.customerId.firstName + " " + record.customerId.lastName}</Typography.Text>;
		},
	},

	{
		title: "Address",
		dataIndex: "address",
		key: "address",
		render: (_text: string, record: Order) => {
			return <Typography.Text>{record.address}</Typography.Text>;
		},
	},
	{
		title: "Comment",
		dataIndex: "comment",
		key: "comment",
		render: (_text: string, record: Order) => {
			return <Typography.Text>{record?.comment}</Typography.Text>;
		},
	},
	{
		title: "Payment Mode",
		dataIndex: "paymentMode",
		key: "paymentMode",
		render: (_text: string, record: Order) => {
			return <Typography.Text>{record.paymentMode}</Typography.Text>;
		},
	},
	{
		title: "Status",
		dataIndex: "orderStatus",
		key: "orderStatus",
		render: (_text: boolean, record: Order) => {
			return (
				<>
					<Tag bordered={false} color={colorMapping[record.orderStatus]}>
						{capitalizeFirst(record.orderStatus)}
					</Tag>
				</>
			);
		},
	},
	{
		title: "Total",
		dataIndex: "total",
		key: "total",
		render: (text: string) => {
			return <Typography.Text>₹{text}</Typography.Text>;
		},
	},
	{
		title: "CreatedAt",
		dataIndex: "createdAt",
		key: "createdAt",
		render: (text: string) => {
			return <Typography.Text>{format(new Date(text), "dd/MM/yyy HH:mm")}</Typography.Text>;
		},
	},
	{
		title: "Action",
		render: (_: string, record: Order) => {
			return <Link to={`/orders/${record._id}`}>Details</Link>;
		},
	},
];

const Orders = () => {
	const [form] = Form.useForm();
	const { user } = useAuthStore();
	const queryClient = useQueryClient();
	const [messageApi, contextHolder] = message.useMessage();

	const [queryParams, setQueryParams] = React.useState({
		perPage: ORDER_PER_PAGE,
		currentPage: 1,
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});

	React.useEffect(() => {
		if (user?.tenant) {
			socket.on("order-update", (data) => {
				// todo: data.event_type =
				if (
					(data.event_type === OrderEvents.ORDER_CREATE && data.data.paymentMode === PaymentMode.CASH) ||
					(data.event_type === OrderEvents.PAYMENT_STATUS_UPDATE &&
						data.data.paymentStatus === PaymentStatus.PAID &&
						data.data.paymentMode === PaymentMode.CARD)
				) {
					queryClient.setQueryData(["orders"], (old: Order[]) => [data.data, ...old]);
					messageApi.open({
						type: "success",
						content: "New Order Received",
					});
				}
			});

			socket.on("join", (data) => {
				console.log("User joined in", data.roomId);
			});
			socket.emit("join", { tenantId: user.tenant.id });
		}

		return () => {
			socket.off("join");
			socket.off("order-update");
		};
	}, [messageApi, queryClient, user?.tenant]);

	const {
		data: orders,
		isFetching,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["orders", queryParams],
		queryFn: async () => {
			// if admin user then make sure to send tenantId , or tenant id from selected filter
			const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
			const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();
			return await getOrders(queryString).then((res) => res.data);
		},
	});

	const onFilterChange = async (changeFileds: FiledData[]) => {
		console.log(changeFileds);
		const changedFilterFields = changeFileds
			.map((item) => ({
				[item.name[0]]: item.value,
			}))
			.reduce((acc, item) => ({ ...acc, ...item }), {});

		setQueryParams((prev) => ({
			...prev,
			...changedFilterFields,
			currentPage: 1,
		}));
	};

	if (isLoading) {
		return <h1>Loding...</h1>;
	}

	return (
		<>
			{contextHolder}

			<Space direction="vertical" size="large" style={{ width: "100%" }}>
				<Flex justify="space-between">
					<Breadcrumb
						separator={<RightOutlined />}
						items={[
							{
								title: <Link to="/">Dashboard</Link>,
							},
							{
								title: "Orders",
							},
						]}
					/>
					{isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
					{isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
				</Flex>
				{user?.role === "admin" && (
					<Form form={form} onFieldsChange={onFilterChange}>
						<OrderFilterForm />
					</Form>
				)}

				<Table
					columns={columns}
					rowKey={"_id"}
					dataSource={orders.data}
					pagination={{
						total: orders?.total,
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
			</Space>
		</>
	);
};

export default Orders;

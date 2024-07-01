import { Breadcrumb, Button, Flex, Form, Space, Typography, Image, Spin, Table } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ToppingFilter from "./ToppingFilter";
import { Topping } from "../../types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getToppings } from "../../http/api";
import React from "react";
import { TOPPING_PER_PAGE } from "../../constants";
import { useAuthStore } from "../../store";

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
	const { user } = useAuthStore();

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

	if (isLoading) {
		return <h1>Loading.....</h1>;
	}

	console.log(toppings);

	const handleDeleteTopping = (toppingId: string) => {
		console.log("toppingId: " + toppingId);
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
						<Button type="primary" icon={<PlusOutlined />}>
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
			</Space>
		</>
	);
};

export default Toppings;

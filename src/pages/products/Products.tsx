import { Link } from "react-router-dom";
import { Breadcrumb, Button, Flex, Form, Space, Table, Image, Typography, Tag, Spin } from "antd";
import { RightOutlined, LoadingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";
import { FiledData, Product } from "../../types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PRODUCT_PER_PAGE } from "../../constants";
import { useMemo, useState } from "react";
import { getProducts } from "../../http/api";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";

const columns = [
	{
		title: "Product Name",
		dataIndex: "name",
		key: "name",
		render: (_text: string, record: Product) => {
			return (
				<div>
					<Space>
						<Image width={60} src={record.image} />
						<Typography.Text>{record.name}</Typography.Text>
					</Space>
				</div>
			);
		},
	},
	{
		title: "Description",
		dataIndex: "description",
		key: "description",
	},
	{
		title: "Status",
		dataIndex: "isPublish",
		key: "isPublish",
		render: (_: boolean, record: Product) => {
			return <>{record.isPublish ? <Tag color="green">Published</Tag> : <Tag color="red">Draft</Tag>}</>;
		},
	},
	{
		title: "CreatedAt",
		dataIndex: "createdAt",
		key: "createdAt",
		render: (text: string) => {
			return <Typography.Text>{format(new Date(text), "dd/MM/yyyy HH:mm")}</Typography.Text>;
		},
	},
];

const Products = () => {
	const [filterForm] = Form.useForm();
	const { user } = useAuthStore();
	const [queryParams, setQueryParams] = useState({
		perPage: PRODUCT_PER_PAGE,
		currentPage: 1,
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});

	// fetching product data
	const {
		data: products,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["products", queryParams],
		queryFn: () => {
			const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
			const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();
			return getProducts(queryString).then((res) => res.data);
		},
		placeholderData: keepPreviousData,
	});

	// debouncing
	const debouncedQUpdate = useMemo(() => {
		return debounce((value: string | undefined) => {
			setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
		}, 500);
	}, []);

	// Filter products
	const onFilterChange = (changedFields: FiledData[]) => {
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
				currentPage: 1,
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
								title: "Products",
							},
						]}
					/>
					{isFetching && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
					{isError && <Typography.Text type="danger">{error.message}</Typography.Text>}
				</Flex>
				<Form form={filterForm} onFieldsChange={onFilterChange}>
					<ProductsFilter>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
							Add Product
						</Button>
					</ProductsFilter>
				</Form>

				{/* Table */}
				<Table
					columns={[
						...columns,
						{
							title: "Actions",
							render: () => {
								return (
									<Space>
										<Button type="link" onClick={() => {}}>
											<EditOutlined />
											Edit
										</Button>
										<Button type="link">
											<DeleteOutlined />
											Delete
										</Button>
									</Space>
								);
							},
						},
					]}
					dataSource={products?.data}
					rowKey={"id"}
					pagination={{
						total: products?.total,
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

export default Products;

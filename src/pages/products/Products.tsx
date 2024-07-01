import { Link } from "react-router-dom";
import { Breadcrumb, Button, Flex, Form, Space, Table, Image, Typography, Tag, Spin, Drawer, theme } from "antd";
import { RightOutlined, LoadingOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";
import { FiledData, Product } from "../../types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PRODUCT_PER_PAGE } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helpers";

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
	const [form] = Form.useForm();
	const {
		token: { colorBgLayout },
	} = theme.useToken();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [filterForm] = Form.useForm();
	const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
	const { user } = useAuthStore();
	const [queryParams, setQueryParams] = useState({
		perPage: PRODUCT_PER_PAGE,
		currentPage: 1,
		tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
	});

	useEffect(() => {
		if (currentProduct) {
			setDrawerOpen(true);
			const priceConfiguration = Object.entries(currentProduct.priceConfiguration).reduce((acc, [key, value]) => {
				const stringifiedKey = JSON.stringify({
					configurationKey: key,
					priceType: value.priceType,
				});

				return {
					...acc,
					[stringifiedKey]: value.availableOptions,
				};
			}, {});

			const attributes = currentProduct.attributes.reduce((acc, item) => {
				return {
					...acc,
					[item.name]: item.value,
				};
			}, {});

			form.setFieldsValue({
				...currentProduct,
				priceConfiguration,
				attributes,

				categoryId: currentProduct.category._id,
			});
		}
	}, [currentProduct, form]);

	// fetching product data
	const {
		data: products,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["products", queryParams],
		queryFn: async () => {
			const filterParams = Object.fromEntries(Object.entries(queryParams).filter((item) => !!item[1]));
			const queryString = new URLSearchParams(filterParams as unknown as Record<string, string>).toString();
			return await getProducts(queryString).then((res) => res.data);
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

	const queryClient = useQueryClient();
	const { mutate: productMutate, isPending: isCreateProductLoading } = useMutation({
		mutationKey: ["createProduct"],
		mutationFn: async (data: FormData) => {
			if (currentProduct) {
				return updateProduct(data, currentProduct._id).then((res) => res.data);
			} else {
				return createProduct(data).then((res) => res.data);
			}
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			form.resetFields();
			setDrawerOpen(false);
			return;
		},
	});

	// Handle form data
	const onHandleSubmit = async () => {
		await form.validateFields();
		const priceConfiguration = form.getFieldValue("priceConfiguration");
		const pricing = Object.entries(priceConfiguration).reduce((acc, [key, value]) => {
			const parsedKey = JSON.parse(key);
			return {
				...acc,
				[parsedKey.configurationKey]: {
					priceType: parsedKey.priceType,
					availableOptions: value,
				},
			};
		}, {});

		const categoryId = form.getFieldValue("categoryId");
		const attributes = Object.entries(form.getFieldValue("attributes")).map(([key, value]) => {
			return {
				name: key,
				value: value,
			};
		});

		const postData = {
			...form.getFieldsValue(),
			tenantId: user?.role === "manager" ? user.tenant?.id : form.getFieldValue("tenantId"),
			isPublish: form.getFieldValue("isPublish") ? true : false,
			image: form.getFieldValue("image"),
			categoryId,
			priceConfiguration: pricing,
			attributes: attributes,
		};

		const formData = makeFormData(postData);
		await productMutate(formData);
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
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>
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
							render: (_, record: Product) => {
								return (
									<Space>
										<Button
											type="link"
											onClick={() => {
												setCurrentProduct(record);
											}}
										>
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
				{/* Drawer */}

				<Drawer
					title={currentProduct ? "Update Product" : "Add Product"}
					open={drawerOpen}
					width={720}
					styles={{ body: { background: colorBgLayout } }}
					destroyOnClose={true}
					onClose={() => {
						setCurrentProduct(null);
						form.resetFields();
						setDrawerOpen(false);
					}}
					extra={
						<Space>
							<Button
								onClick={() => {
									setCurrentProduct(null);
									form.resetFields();
									setDrawerOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button type="primary" onClick={onHandleSubmit} loading={isCreateProductLoading}>
								Save
							</Button>
						</Space>
					}
				>
					<Form layout="vertical" form={form}>
						<ProductForm form={form} />
					</Form>
				</Drawer>
			</Space>
		</>
	);
};

export default Products;

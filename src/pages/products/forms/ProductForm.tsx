import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, FormInstance, Input, Row, Select, Space, Switch, Typography } from "antd";

import { Category, Tenant } from "../../../types";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthStore } from "../../../store";

const ProductForm = ({ form }: { form: FormInstance }) => {
	const { user } = useAuthStore();
	const selectedCategory = Form.useWatch("categoryId");
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: () => {
			return getCategories();
		},
	});
	const { data: tenants } = useQuery({
		queryKey: ["tenants"],
		queryFn: async () => {
			return getTenants(`perPage=100&currentPage=1`).then((res) => res.data);
		},
	});

	return (
		<>
			<Row>
				<Col span={24}>
					<Space direction="vertical" size="large">
						<Card title="Product Info" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<Form.Item
										label="Name"
										name="name"
										rules={[
											{
												required: true,
												message: "Product name is required!",
											},
										]}
									>
										<Input size="large" placeholder="Product Name" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Category"
										name="categoryId"
										rules={[
											{
												required: true,
												message: "Category is required!",
											},
										]}
									>
										<Select
											size="large"
											style={{ width: "100%" }}
											placeholder="Select Category"
											allowClear={true}
											onChange={() => {}}
										>
											{categories?.data.map((category: Category) => (
												<Select.Option value={category._id} key={category._id}>
													{category.name}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col span={24}>
									<Form.Item
										label="Description"
										name="description"
										rules={[
											{
												required: true,
												message: "Description is required!",
											},
										]}
									>
										<Input.TextArea
											rows={2}
											maxLength={100}
											style={{ resize: "none" }}
											size="large"
											placeholder="Description"
										/>
									</Form.Item>
								</Col>
							</Row>
						</Card>

						<Card title="Product Image" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<ProductImage initialImage={form.getFieldValue("image")} />
								</Col>
							</Row>
						</Card>

						{user?.role !== "manager" && (
							<Card title="Resturant Info" bordered={false}>
								<Row gutter={20}>
									<Col span={24}>
										<Form.Item
											label=" Select Restaurant"
											name="tenantId"
											rules={[
												{
													required: true,
													message: "Please Select Restuarant!",
												},
											]}
										>
											<Select
												size="large"
												style={{ width: "100%" }}
												placeholder="Select Restaurant"
												allowClear={true}
												onChange={() => {}}
											>
												{tenants?.data.map((tenants: Tenant) => (
													<Select.Option value={String(tenants.id)} key={tenants.id}>
														{tenants.name}
													</Select.Option>
												))}
											</Select>
										</Form.Item>
									</Col>
								</Row>
							</Card>
						)}
						{selectedCategory && <Pricing selectedCategory={selectedCategory} />}
						{selectedCategory && <Attributes selectedCategory={selectedCategory} />}

						<Card title="Other Properties" bordered={false}>
							<Row gutter={20}>
								<Col span={24}>
									<Space>
										<Form.Item name="isPublish">
											<Switch defaultChecked={false} onChange={() => {}} checkedChildren="YES" unCheckedChildren="NO" />
										</Form.Item>
										<Typography.Text style={{ marginBottom: 22, display: "block" }}>Published</Typography.Text>
									</Space>
								</Col>
							</Row>
						</Card>
					</Space>
				</Col>
			</Row>
		</>
	);
};

export default ProductForm;

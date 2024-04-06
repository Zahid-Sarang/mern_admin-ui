import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Category, Tenant } from "../../../types";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";

const ProductForm = () => {
	const selectedCategory = Form.useWatch("categoryId");
	// Categories
	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: () => {
			return getCategories();
		},
	});

	// Tenants
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
												<Select.Option value={JSON.stringify(category)} key={category._id}>
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
									<Form.Item
										label=""
										name="image"
										rules={[
											{
												required: true,
												message: "Please upload a prodcut image!",
											},
										]}
									>
										<Upload listType="picture-card">
											<Space direction="vertical">
												<PlusOutlined />
												<Typography.Text>Upload</Typography.Text>
											</Space>
										</Upload>
									</Form.Item>
								</Col>
							</Row>
						</Card>

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
												<Select.Option value={tenants.id} key={tenants.id}>
													{tenants.name}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
						</Card>

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

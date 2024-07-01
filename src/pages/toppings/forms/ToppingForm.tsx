import { Card, Col, Form, FormInstance, Input, InputNumber, Row, Select, Space, Switch, Typography } from "antd";
import { useAuthStore } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../../http/api";
import ToppingImage from "./ToppingImage";
import { Tenant } from "../../../types";

const ToppingForm = ({ form }: { form: FormInstance }) => {
	const { user } = useAuthStore();

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
						<Card title="Topping Info" bordered={false} style={{ width: "650px" }}>
							<Row gutter={30}>
								<Col span={12}>
									<Form.Item
										label="Name"
										name="name"
										rules={[
											{
												required: true,
												message: "Topping name is required!",
											},
										]}
									>
										<Input size="large" placeholder="Topping Name" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Price"
										name="price"
										rules={[
											{
												required: true,
												message: "Topping Price should be a valid number",
											},
										]}
									>
										<InputNumber addonAfter="₹" size="large" placeholder="Topping Price" style={{ width: "100%" }} />
									</Form.Item>
								</Col>
							</Row>
						</Card>
						{/* Toppings Image */}
						<Card title="Topping Image" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<ToppingImage initialImage={form.getFieldValue("image")} />
								</Col>
							</Row>
						</Card>

						{/* restaurants */}

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

export default ToppingForm;

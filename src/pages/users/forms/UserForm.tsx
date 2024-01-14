import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
	const { data: tenants } = useQuery({
		queryKey: ["tenants"],
		queryFn: async () => {
			const res = await getTenants();
			return res.data;
		},
	});
	return (
		<>
			<Row>
				<Col span={24}>
					<Space direction="vertical" size="large">
						<Card title="Basic Info" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<Form.Item label="First Name" name="firstName">
										<Input size="large" placeholder="First Name" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Last Name" name="lastName">
										<Input size="large" placeholder="Last Name" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Email" name="email">
										<Input size="large" placeholder="Email" />
									</Form.Item>
								</Col>
							</Row>
						</Card>

						<Card title="Security Info" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<Form.Item label="Password" name="password">
										<Input
											size="large"
											placeholder="Password"
											type="password"
										/>
									</Form.Item>
								</Col>
							</Row>
						</Card>

						<Card title="Role" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<Form.Item label="Role" name="role">
										<Select
											size="large"
											style={{ width: "100%" }}
											placeholder="Select role"
											allowClear={true}
											onChange={() => {}}
										>
											<Select.Option value="admin">Admin</Select.Option>
											<Select.Option value="manager">Manager</Select.Option>
											<Select.Option value="customer">Customer</Select.Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Restaurant" name="tenantId">
										<Select
											size="large"
											style={{ width: "100%" }}
											placeholder="Select Restaurant"
											allowClear={true}
											onChange={() => {}}
										>
											{tenants?.map((tenants: Tenant) => (
												<Select.Option value={tenants.id}>
													{tenants.name}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</Space>
				</Col>
			</Row>
		</>
	);
};

export default UserForm;

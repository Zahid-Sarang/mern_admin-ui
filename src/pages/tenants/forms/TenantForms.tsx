import { Card, Col, Form, Input, Row } from "antd";

const TenantForm = () => {
	return (
		<>
			<Row>
				<Col span={24}>
					<Card title="Restaurant Info">
						<Row gutter={20}>
							<Col span={12}>
								<Form.Item
									label="Restaurant Name"
									name="name"
									rules={[
										{
											required: true,
											message: "Restaurant name is required!",
										},
									]}
								>
									<Input size="large" placeholder="Restaurant Name" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label="Restaurant Address"
									name="address"
									rules={[
										{
											required: true,
											message: "Address is required!",
										},
									]}
								>
									<Input size="large" placeholder="Restaurant Address" />
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default TenantForm;

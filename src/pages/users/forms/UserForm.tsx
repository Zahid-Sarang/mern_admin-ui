import { Card, Col, Form, Input, Row } from "antd";

const UserForm = () => {
	return (
		<>
			<Row>
				<Col span={24}>
					<Card title="Basic Info" bordered={false}>
						<Row gutter={20}>
							<Col span={12}>
								<Form.Item label="First Name" name="firstName">
									<Input placeholder="First Name" />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Last Name" name="lastName">
									<Input placeholder="Last Name" />
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default UserForm;

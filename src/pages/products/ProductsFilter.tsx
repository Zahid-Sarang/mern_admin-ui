import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd";

type ProductsFilerProps = {
	children?: React.ReactNode;
};

const ProductsFilter = ({ children }: ProductsFilerProps) => {
	return (
		<Card>
			<Row justify="space-between">
				<Col span={16}>
					<Row gutter={20}>
						<Col span={6}>
							<Form.Item name="q">
								<Input.Search allowClear={true} placeholder="Search" />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name="category">
								<Select style={{ width: "100%" }} placeholder="Select category" allowClear={true}>
									<Select.Option value="pizza">Pizza</Select.Option>
									<Select.Option value="drinks">Cold Drinks</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name="restaurant">
								<Select style={{ width: "100%" }} placeholder="Select restaurant" allowClear={true}>
									<Select.Option value="mumbai">Mumbai Chat</Select.Option>
									<Select.Option value="delhi-zaika">Delhi Zaika</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Space>
								<Switch defaultChecked onChange={() => {}} />
								<Typography.Text>Show only published</Typography.Text>
							</Space>
						</Col>
					</Row>
				</Col>
				<Col span={8} style={{ display: "flex", justifyContent: "end" }}>
					{children}
				</Col>
			</Row>
		</Card>
	);
};

export default ProductsFilter;

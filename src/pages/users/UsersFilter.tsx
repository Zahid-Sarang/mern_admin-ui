import { Card, Col, Form, Input, Row, Select } from "antd";

import * as React from "react";

type UsersFilterProps = {
	children?: React.ReactNode;
	// onFilterChange: (filterName: string, filterValue: string) => void;
};

const UsersFilter = ({ children }: UsersFilterProps) => {
	return (
		<>
			<Card>
				<Row justify="space-between">
					<Col span={16}>
						<Row gutter={20}>
							<Col span={8}>
								<Form.Item name="q">
									<Input.Search allowClear={true} placeholder="Search" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="role">
									<Select style={{ width: "100%" }} placeholder="Select role" allowClear={true}>
										<Select.Option value="admin">Admin</Select.Option>
										<Select.Option value="manager">Manager</Select.Option>
										<Select.Option value="customer">Customer</Select.Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
					</Col>
					<Col span={8} style={{ display: "flex", justifyContent: "end" }}>
						{children}
					</Col>
				</Row>
			</Card>
		</>
	);
};

export default UsersFilter;

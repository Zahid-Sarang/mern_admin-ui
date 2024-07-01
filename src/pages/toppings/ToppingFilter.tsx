import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd";
import React from "react";
import { useAuthStore } from "../../store";
import { Tenant } from "../../types";
import { getTenants } from "../../http/api";
import { useQuery } from "@tanstack/react-query";

type ToppingFilterProps = {
	children: React.ReactNode;
};

const ToppingFilter = ({ children }: ToppingFilterProps) => {
	const { user } = useAuthStore();

	const { data: restaurants } = useQuery({
		queryKey: ["restaurants"],
		queryFn: () => {
			return getTenants(`perPage=100&currentPage=1`);
		},
	});

	return (
		<Card>
			<Row justify="space-between">
				<Col span={16}>
					<Row gutter={20}>
						<Col span={8}>
							<Form.Item name="q">
								<Input.Search allowClear={true} placeholder="Search" />
							</Form.Item>
						</Col>
						{user?.role === "admin" && (
							<Col span={8}>
								<Form.Item name="tenantId">
									<Select style={{ width: "100%" }} placeholder="Select restaurant" allowClear={true}>
										{restaurants?.data.data.map((restaurant: Tenant) => {
											return (
												<Select.Option key={restaurant.id} value={restaurant.id}>
													{restaurant.name}
												</Select.Option>
											);
										})}
									</Select>
								</Form.Item>
							</Col>
						)}
						<Col span={6}>
							<Space>
								<Form.Item name="isPublish">
									<Switch defaultChecked={false} onChange={() => {}} />
								</Form.Item>
								<Typography.Text style={{ marginBottom: 22, display: "block" }}>published item</Typography.Text>
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

export default ToppingFilter;

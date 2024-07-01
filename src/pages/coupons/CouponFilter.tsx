import { Card, Col, Form, Input, Row, Select } from "antd";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useAuthStore } from "../../store";
import { getTenants } from "../../http/api";
import { Tenant } from "../../types";
type CouponFilterProps = {
	children: React.ReactNode;
};

const CouponFilter = ({ children }: CouponFilterProps) => {
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
					</Row>
				</Col>

				<Col span={8} style={{ display: "flex", justifyContent: "end" }}>
					{children}
				</Col>
			</Row>
		</Card>
	);
};

export default CouponFilter;

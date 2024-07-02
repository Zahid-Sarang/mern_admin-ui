import { Card, Col, Form, Row, Select } from "antd";
import { useAuthStore } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const OrderFilterForm = () => {
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
			</Row>
		</Card>
	);
};

export default OrderFilterForm;

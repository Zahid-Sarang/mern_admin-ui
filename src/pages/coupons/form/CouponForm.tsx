import { Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space } from "antd";
import { useAuthStore } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);

const CouponForm = () => {
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
					<Space direction="vertical" size={"large"}>
						<Card title="Coupon Info" bordered={false}>
							<Row gutter={20}>
								<Col span={12}>
									<Form.Item
										label="Coupon Title"
										name="title"
										rules={[
											{
												required: true,
												message: "Title is required!",
											},
										]}
									>
										<Input size="large" placeholder="Coupon Title" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Code"
										name="code"
										rules={[
											{
												required: true,
												message: "Code is required!",
											},
										]}
									>
										<Input size="large" placeholder="Topping Price" style={{ width: "100%" }} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label="Valid Up To"
										name="validUpto"
										rules={[
											{
												required: true,
												message: "validUpto is required!",
											},
										]}
									>
										<DatePicker showTime />
									</Form.Item>
								</Col>

								<Col span={12}>
									<Form.Item
										label="Discount Percentage"
										name="discount"
										rules={[
											{
												required: true,
												message: "Discount Percentage is required!",
											},
										]}
									>
										<InputNumber addonAfter="%" size="large" placeholder="Percentage" style={{ width: "100%" }} />
									</Form.Item>
								</Col>
							</Row>
						</Card>

						{/* Restaurant */}

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
					</Space>
				</Col>
			</Row>
		</>
	);
};

export default CouponForm;

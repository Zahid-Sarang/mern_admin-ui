import { Card, Col, Input, Row, Select } from "antd";

import * as React from "react";

type TenatsFilterProps = {
	children?: React.ReactNode;
	onFilterChange: (filterName: string, filterValue: string) => void;
};

const TetnantsFilter = ({ onFilterChange, children }: TenatsFilterProps) => {
	return (
		<>
			<Card>
				<Row justify="space-between">
					<Col span={16}>
						<Row gutter={20}>
							<Col span={8}>
								<Input.Search
									allowClear={true}
									placeholder="Search"
									onChange={(e) =>
										onFilterChange("UserSearchQuery", e.target.value)
									}
								/>
							</Col>
							<Col span={8}>
								<Select
									style={{ width: "100%" }}
									placeholder="Select status"
									allowClear={true}
									onChange={(selectedItem) =>
										onFilterChange("statusFilter", selectedItem)
									}
								>
									<Select.Option value="ban">Ban</Select.Option>
									<Select.Option value="active">Active</Select.Option>
								</Select>
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

export default TetnantsFilter;

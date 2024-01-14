import { Card, Col, Input, Row } from "antd";

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
							<Col span={12}>
								<Input.Search
									allowClear={true}
									placeholder="Search"
									onChange={(e) =>
										onFilterChange("UserSearchQuery", e.target.value)
									}
								/>
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

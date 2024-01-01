import {
	Button,
	Card,
	Col,
	List,
	Row,
	Skeleton,
	Space,
	Statistic,
	Tag,
	Typography,
} from "antd";
import Icon from "@ant-design/icons";
import { useAuthStore } from "../store";
import { BarChartIcon } from "../components/icons/BarChart";
import BasketIcon from "../components/icons/BasketIcon";
import { BagIcon } from "../components/icons/BagIcon";
import { Link } from "react-router-dom";
import { ComponentType } from "react";
const { Title, Text } = Typography;

const list = [
	{
		OrderSummary: "Peperoni, Margarita ...",
		address: "Bandra, Mumbai",
		amount: 1200,
		status: "preparing",
		loading: false,
	},
	{
		OrderSummary: "Paneer, Chicken BBQ ...",
		address: "Balurghat, West bengal",
		amount: 2000,
		status: "on the way",
		loading: false,
	},
	{
		OrderSummary: "Paneer, Chicken BBQ ...",
		address: "Balurghat, West bengal",
		amount: 2000,
		status: "on the way",
		loading: false,
	},
	{
		OrderSummary: "Paneer, Chicken BBQ ...",
		address: "Balurghat, West bengal",
		amount: 2000,
		status: "on the way",
		loading: false,
	},
	{
		OrderSummary: "Paneer, Chicken BBQ ...",
		address: "Balurghat, West bengal",
		amount: 2000,
		status: "Delivered",
		loading: false,
	},
	{
		OrderSummary: "Paneer, Chicken BBQ ...",
		address: "Balurghat, West bengal",
		amount: 2000,
		status: "Delivered",
		loading: false,
	},
];

interface CardTitleProps {
	title: string;
	PrefixIcon: ComponentType<unknown>;
	iconColor?: string;
	iconBackgroundColor?: string;
	iconRadius?: string;
}

const CardTitle = ({
	title,
	PrefixIcon,
	iconColor,
	iconBackgroundColor,
	iconRadius,
}: CardTitleProps) => {
	const iconStyle = {
		color: iconColor,
		backgroundColor: iconBackgroundColor,
		borderRadius: iconRadius,
		padding: "8px", // Adjust padding as needed
	};

	return (
		<Space>
			<Icon component={PrefixIcon} style={iconStyle} />
			{title}
		</Space>
	);
};

function HomePage() {
	const { user } = useAuthStore();
	return (
		<div>
			<Title level={4}>Welcome, {user?.firstName} 🤗</Title>
			<Row className="mt-4" gutter={16}>
				<Col span={12}>
					<Row gutter={[16, 16]}>
						<Col span={12}>
							<Card bordered={false}>
								<Statistic
									title={
										<CardTitle
											title="Sales"
											PrefixIcon={BagIcon}
											iconColor="#13C925"
											iconBackgroundColor="#CAF3CE"
											iconRadius="50%"
										/>
									}
									value={28}
								/>
							</Card>
						</Col>
						<Col span={12}>
							<Card bordered={false}>
								<Statistic
									title={
										<CardTitle
											title="Total sale"
											PrefixIcon={BarChartIcon}
											iconColor="#14AAFF"
											iconBackgroundColor="#E1F8FF"
											iconRadius="50%"
										/>
									}
									value={50000}
									precision={2}
									prefix="₹"
									valueStyle={{ color: "#3f8600" }}
								/>
							</Card>
						</Col>
						<Col span={24}>
							<Card
								title={
									<CardTitle
										title="Sales"
										PrefixIcon={BarChartIcon}
										iconColor="#14AAFF"
										iconBackgroundColor="#E1F8FF"
										iconRadius="50%"
									/>
								}
								bordered={false}
							></Card>
						</Col>
					</Row>
				</Col>
				<Col span={12}>
					<Card
						bordered={false}
						title={
							<CardTitle
								title="Recent orders"
								PrefixIcon={BasketIcon}
								iconColor="#F65F42"
								iconBackgroundColor="#FEECE8"
								iconRadius="50%"
							/>
						}
					>
						<List
							className="demo-loadmore-list"
							loading={false}
							itemLayout="horizontal"
							loadMore={true}
							dataSource={list}
							renderItem={(item) => (
								<List.Item>
									<Skeleton avatar title={false} loading={item.loading} active>
										<List.Item.Meta
											title={
												<a href="https://ant.design">{item.OrderSummary}</a>
											}
											description={item.address}
										/>
										<Row style={{ flex: 1 }} justify="space-between">
											<Col>
												<Text strong>₹{item.amount}</Text>
											</Col>
											<Col>
												<Tag color="volcano">{item.status}</Tag>
											</Col>
										</Row>
									</Skeleton>
								</List.Item>
							)}
						/>
						<div style={{ marginTop: 20 }}>
							<Button type="link">
								<Link to="/orders">See all orders</Link>
							</Button>
						</div>
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default HomePage;

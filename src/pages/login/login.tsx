import { Card, Layout, Space, Form, Input, Checkbox, Button, Flex } from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";

const LoginPage = () => {
	return (
		<>
			<Layout
				style={{ height: "100vh", display: "grid", placeItems: "center" }}
			>
				<Space direction="vertical" align="center" size="large">
					<Layout.Content
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Logo />
					</Layout.Content>
					<Card
						bordered={false}
						style={{ width: 300 }}
						title={
							<Space
								style={{
									width: "100%",
									fontSize: 16,
									justifyContent: "center",
								}}
							>
								<LockFilled /> Sign in
							</Space>
						}
					>
						<Form
							initialValues={{ remember: true }}
							onFinish={(values) => {
								console.log(values);
							}}
						>
							<Form.Item
								name="userName"
								rules={[
									{
										required: true,
										message: "Please enter your username",
									},
									{
										type: "email",
										message: "Email is not valid",
									},
								]}
							>
								<Input prefix={<UserOutlined />} placeholder="UserName" />
							</Form.Item>
							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: "Please enter your Password",
									},
								]}
							>
								<Input.Password
									prefix={<LockOutlined />}
									placeholder="Password"
								/>
							</Form.Item>
							<Flex justify="space-between">
								<Form.Item name="remember" valuePropName="checked">
									<Checkbox>Remember me</Checkbox>
								</Form.Item>
								<a id="login-form-forgot" href="#">
									Forgot Password
								</a>
							</Flex>
							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									style={{ width: "100%" }}
								>
									Log in
								</Button>
							</Form.Item>
						</Form>
					</Card>
				</Space>
			</Layout>
		</>
	);
};

export default LoginPage;

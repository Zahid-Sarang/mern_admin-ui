import {
	Breadcrumb,
	Button,
	Drawer,
	Flex,
	Form,
	Space,
	Spin,
	Table,
	theme,
	Typography,
} from "antd";
import {
	RightOutlined,
	PlusOutlined,
	LoadingOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { User, CreateUserData, FiledData } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilter from "./UsersFilter";
import { useMemo, useState } from "react";
import UserForm from "./forms/UserForm";
import { USER_PER_PAGE } from "../../constants";
import { debounce } from "lodash";

const columns = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
	},
	{
		title: "Name",
		dataIndex: "firstName",
		key: "firstName",
		render: (_text: string, record: User) => {
			return (
				<div>
					{record.firstName} {record.lastName}
				</div>
			);
		},
	},
	{
		title: "Email",
		dataIndex: "email",
		key: "email",
	},
	{
		title: "Role",
		dataIndex: "role",
		key: "role",
	},
	{
		title: "Restaurant",
		dataIndex: "tenant",
		key: "tenant",
		render: (_text: string, record: User) => {
			return <div>{record.tenant?.name}</div>;
		},
	},
];

const Users = () => {
	const [form] = Form.useForm();
	const [filterForm] = Form.useForm();
	const queryClient = useQueryClient();
	const {
		token: { colorBgLayout },
	} = theme.useToken();

	const [queryParams, setQueryParams] = useState({
		perPage: USER_PER_PAGE,
		currentPage: 1,
	});

	const [drawerOpen, setDrawerOpen] = useState(false);
	const { user } = useAuthStore();
	if (user?.role === "manager") {
		return <Navigate to="/" replace={true} />;
	}
	const {
		data: users,
		isFetching,
		isError,
		error,
	} = useQuery({
		queryKey: ["users", queryParams],
		queryFn: () => {
			const filterParams = Object.fromEntries(
				Object.entries(queryParams).filter((item) => !!item[1])
			);
			const queryString = new URLSearchParams(
				filterParams as unknown as Record<string, string>
			).toString();
			console.log("queryString", queryString);
			return getUsers(queryString).then((res) => res.data);
		},
		placeholderData: keepPreviousData,
	});

	const { mutate: userMutate } = useMutation({
		mutationKey: ["user"],
		mutationFn: async (data: CreateUserData) =>
			createUser(data).then((res) => res.data),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
			return;
		},
	});

	const onHandleSubmit = async () => {
		await form.validateFields();
		userMutate(form.getFieldsValue());
		form.resetFields();
		setDrawerOpen(false);
	};

	// debouncing
	const debouncedQUpdate = useMemo(() => {
		return debounce((value: string | undefined) => {
			setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
		}, 500);
	}, []);

	// filter Function
	const onFilterChange = (changedFields: FiledData[]) => {
		const changedFilterFields = changedFields
			.map((item) => ({
				[item.name[0]]: item.value,
			}))
			.reduce((acc, item) => ({ ...acc, ...item }), {});

		if ("q" in changedFilterFields) {
			debouncedQUpdate(changedFilterFields.q);
		} else {
			setQueryParams((prev) => ({
				...prev,
				...changedFilterFields,
				currentPage: 1,
			}));
		}
	};

	return (
		<>
			<Space direction="vertical" style={{ width: "100%" }} size="large">
				<Flex justify="space-between">
					<Breadcrumb
						separator={<RightOutlined />}
						items={[
							{
								title: <Link to="/">Dashboard</Link>,
							},
							{
								title: "Users",
							},
						]}
					/>
					{isFetching && (
						<Spin
							indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
						/>
					)}
					{isError && (
						<Typography.Text type="danger">{error.message}</Typography.Text>
					)}
				</Flex>
				<Form form={filterForm} onFieldsChange={onFilterChange}>
					<UsersFilter>
						<Button
							type="primary"
							icon={<PlusOutlined />}
							onClick={() => setDrawerOpen(true)}
						>
							Create User
						</Button>
					</UsersFilter>
				</Form>
				<Table
					columns={columns}
					dataSource={users?.data}
					rowKey={"id"}
					pagination={{
						total: users?.total,
						pageSize: queryParams.perPage,
						current: queryParams.currentPage,
						onChange: (page, pageSie) => {
							setQueryParams((prev) => {
								return {
									...prev,
									currentPage: page,
								};
							});
						},
						showTotal:(total:number,range:number[]) => {
							return `Showing ${range[0]} - ${range[1]} of ${total} items`;
						}
					}}
				/>

				{/* Drawer */}
				<Drawer
					title="Create User"
					open={drawerOpen}
					width={720}
					styles={{ body: { background: colorBgLayout } }}
					destroyOnClose={true}
					onClose={() => {
						form.resetFields();
						setDrawerOpen(false);
					}}
					extra={
						<Space>
							<Button
								onClick={() => {
									form.resetFields();
									setDrawerOpen(false);
								}}
							>
								Cancel
							</Button>
							<Button type="primary" onClick={onHandleSubmit}>
								Save
							</Button>
						</Space>
					}
				>
					<Form layout="vertical" form={form}>
						<UserForm />
					</Form>
				</Drawer>
			</Space>
		</>
	);
};

export default Users;

import { Form, Space, Typography, Upload, UploadProps, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
const ProductImage = ({ initialImage }: { initialImage: string }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [imageUrl, setImageUrl] = useState<string | null>(initialImage);

	const uploadConfig: UploadProps = {
		name: "file",
		multiple: false,
		showUploadList: false,
		beforeUpload: (file) => {
			const isValidFileType = file.type === "image/jpeg" || file.type === "image/png";
			if (!isValidFileType) {
				console.log("Please upload a valid file type");
				messageApi.error("Please upload a valid only jpeg and png");
			}

			// todo: size validation
			setImageUrl(URL.createObjectURL(file));

			return false;
		},
	};
	return (
		<Form.Item
			label=""
			name="image"
			rules={[
				{
					required: true,
					message: "Please upload a prodcut image!",
				},
			]}
		>
			<Upload listType="picture-card" {...uploadConfig}>
				{contextHolder}
				{imageUrl ? (
					<img src={imageUrl} alt="product-image" style={{ width: "100%" }} />
				) : (
					<Space direction="vertical">
						<PlusOutlined />
						<Typography.Text>Upload</Typography.Text>
					</Space>
				)}
			</Upload>
		</Form.Item>
	);
};

export default ProductImage;

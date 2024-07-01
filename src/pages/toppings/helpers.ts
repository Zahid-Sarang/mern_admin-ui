import { CreateToppingData, ImageFiled } from "../../types";

export const makeFormDataTopping = (data: CreateToppingData) => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (key === "image") {
			formData.append(key, (value as ImageFiled).file);
		} else {
			formData.append(key, value as string);
		}
	});

	return formData;
};

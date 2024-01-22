import { self } from "../http/api";
export const getSelf = async () => {
	const { data } = await self();
	return data;
};

export const PER_PAGE = 8;

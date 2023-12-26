import { self } from "../http/api";
export const getSelf = async () => {
	const { data } = await self();
	return data;
};

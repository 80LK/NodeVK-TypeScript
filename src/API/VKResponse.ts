interface VKResponse<T> {
	response?: T;
	error?: {
		error_code: number;
		error_msg: string;
		request_params: { key: string, value: string }[];
	};
}

export default VKResponse;

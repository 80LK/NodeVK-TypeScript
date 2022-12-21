import SessionConfig, { TypeToken } from "../Session/SessionConfig";
import SingleOrArray from "../utils/SingleOrArray";
import VKResponse from "./VKResponse";

interface ErrorMessageCallback {
	(method: string, currentType: TypeToken, allowed: SingleOrArray<TypeToken>): string
}

function errorMessageCallback(method: string, currentType: TypeToken, allowed: SingleOrArray<TypeToken>): string {
	let error = `Method "${method}" can't call with ${currentType} token.`;
	if (Array.isArray(allowed)) {
		if (allowed.length == 1) {
			error += ` Allowed ${allowed[0]} type token.`;
		} else if (allowed.length == 2) {
			error += ` Allowed ${allowed.join(" and ")} types token.`;
		} else {
			const last_allowed = allowed.pop();
			error += ` Allowed ${allowed.join(", ")} and ${last_allowed} types token.`;
		}
	} else {
		error += ` Allowed ${allowed} type token.`;
	}
	return error;
}

class API {
	private static readonly API_URL: string = "https://api.vk.com/method/";

	constructor(private readonly config: SessionConfig, protected readonly type: TypeToken) { }

	public async callMethod<T = any>(method: string, params: NodeJS.Dict<any>): Promise<T> {
		const url = new URL(method, API.API_URL);

		url.searchParams.append("access_token", this.config.token);
		url.searchParams.append("v", this.config.version);

		for (const key in params) {
			const value = params[key];
			if (value === undefined) continue;

			url.searchParams.append(key, value.toString())
		}

		const f_resp = await fetch(url, { method: "get" });
		const response: VKResponse<T> = await f_resp.json();

		if (response.error)
			throw response.error;

		return response.response;

	}

	public checkTypeToken(allowed: SingleOrArray<TypeToken>, method: string, error: ErrorMessageCallback | string = errorMessageCallback) {
		if (
			(Array.isArray(allowed) && allowed.includes(this.type))
			|| this.type == allowed
		) return true;

		throw new ReferenceError(typeof error === "function" ? error(method, this.type, allowed) : error);
	}
}


export default API;
export { ErrorMessageCallback };

import { TypeToken } from "../Session/SessionConfig";
import SingleOrArray from "../utils/SingleOrArray";
import API, { ErrorMessageCallback } from "./API";
import VKResponse from "./VKResponse";

interface LongPollServer {
	key: string;
	server: string;
	ts: string
}

class Groups extends API {
	public callMethod<T = any>(method: string, params: NodeJS.Dict<any>): Promise<T> {
		return super.callMethod<T>("groups." + method, params);
	}
	public checkTypeToken(allowed: SingleOrArray<TypeToken>, method: string, error?: string | ErrorMessageCallback): boolean {
		return super.checkTypeToken(allowed, "groups." + method, error);
	}

	public getLongPollServer(group_id: number): Promise<LongPollServer> {
		this.checkTypeToken([TypeToken.GROUP, TypeToken.USER], "getLongPollServer");

		return this.callMethod<LongPollServer>("getLongPollServer", { group_id });
	}
}


export default Groups;

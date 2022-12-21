import API from "./API";
import VKResponse from "./VKResponse";
interface LongPollServer {
	key: string;
	server: string;
	ts: string
}
class Messages extends API {
	public callMethod<T = any>(method: string, params: NodeJS.Dict<any>): Promise<T> {
		return super.callMethod<T>("messages." + method, params);
	}

	public async send(peer_id: number, message: string) {
		const response = await this.callMethod<number>('send', {
			peer_id, message, random_id: 0
		});

		return response;
	}

	public async getLongPollServer(group_id?: number) {
		return await this.callMethod<LongPollServer>("getLongPollServer", { group_id });
	}
}


export default Messages;

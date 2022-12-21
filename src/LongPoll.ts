import { EventEmitter } from "events";
import GroupSession from "./Session/GroupSession";

class GroupLongPoll extends EventEmitter {
	constructor(
		protected readonly session: GroupSession,
		protected readonly group_id: number,
		protected readonly wait: number
	) { super(); }

	private abort: AbortController = new AbortController();
	protected get AbortSignal() {
		return this.abort.signal;
	}


	public async start(): Promise<void> {
		const url = await this.getUrlServer();

		while (!this.abort.signal.aborted) {
			const response = await this.getEvents(url);

			url.searchParams.set('ts', response.ts);
			response.updates.forEach(e => this.emit(e.type, e.object, {
				event_id: e.event_id,
				group_id: e.group_id,
				v: e.v,
				type: e.type
			}));
		}
	}

	public stop() {
		this.abort.abort();
	}

	private async getEvents(url: URL) {
		while (true) {
			//@ts-ignore
			console.log("[REQUEST]:", url.href);
			const resp = await fetch(url, { signal: this.abort.signal });
			if (!this.abort.signal.aborted)
				this.abort = new AbortController();
			const response: { ts?: string, updates?: any[], failed?: 1 | 2 | 3 } = await resp.json();

			console.log("[RESPONSE]:", resp, response);

			if (response.failed) {
				switch (response.failed) {
					case 1:
						console.log(`LongPoll failed ${response.failed}. Repeated try.`);
						url.searchParams.set('ts', response.ts);
						continue;

					default:
						console.log(`LongPoll failed ${response.failed}. Restart LongPoll.`);
						url = await this.getUrlServer();
						continue;
				}
			}

			return response;
		}
	}

	private async getUrlServer() {
		const server_info = await this.session.groups.getLongPollServer(this.group_id);

		const url = new URL(server_info.server);
		url.searchParams.set("act", "a_check");
		url.searchParams.set("wait", this.wait.toString());
		url.searchParams.set("key", server_info.key);
		url.searchParams.set("ts", server_info.ts);
		return url;
	}
};

interface GroupLongPoll {
	on(event: string, callback: (object: any, info: EventInfo) => void): this;
	emit(event: string, object: any, info: EventInfo): boolean;
}

interface EventInfo {
	"type": string;
	"event_id": string;
	"v": string;
	"group_id": number;
}

export default GroupLongPoll;

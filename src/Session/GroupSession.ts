import GroupLongPoll from "../LongPoll";
import Session from "./Session";
import SessionConfig, { TypeToken } from "./SessionConfig";

class GroupSession extends Session {
	public constructor(token: string, group_id: number);
	public constructor(cfg: SessionConfig, group_id: number);
	public constructor(cfg: SessionConfig | string, group_id: number);

	public constructor(cfg: SessionConfig | string, protected readonly group_id: number) {
		super(cfg, TypeToken.GROUP);
	}

	public createLongPoll(wait: number = 25) {
		return new GroupLongPoll(this, this.group_id, wait);
	}
}

export default GroupSession

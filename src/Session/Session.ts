import EventEmitter from "events";
import API from "../API/API";
import Groups from "../API/Groups";
import Messages from "../API/Messages";
import GroupSession from "./GroupSession";
import SessionConfig, { TypeToken } from "./SessionConfig";

class Session {
	private readonly type: TypeToken;
	private readonly config: SessionConfig;

	private readonly api: API;
	public readonly messages: Messages;
	public readonly groups: Groups;

	public constructor(token: string, type?: TypeToken);
	public constructor(cfg: SessionConfig, type?: TypeToken);
	public constructor(cfg: SessionConfig | string, type?: TypeToken);

	public constructor(cfg: SessionConfig | string, type: TypeToken = TypeToken.SERVICE) {
		this.config = this.getSessionConfig(cfg);

		this.type = type;

		this.api = new API(this.config, this.type);
		this.messages = new Messages(this.config, this.type);
		this.groups = new Groups(this.config, this.type);


	}

	public callMethod(method: string, params: NodeJS.Dict<any>) {
		return this.api.callMethod(method, params)
	}

	private getSessionConfig(cfg: SessionConfig | string): SessionConfig {
		if (typeof cfg === "string") cfg = { token: cfg };

		cfg.version = cfg.version || "5.131";
		if (cfg.errorNotThrow === undefined) cfg.errorNotThrow = false;

		return cfg;
	}

}


class LongPoll extends EventEmitter {
	public start() {

	}
}

export default Session;

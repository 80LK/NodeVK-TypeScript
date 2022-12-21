interface SessionConfig {
	token: string;
	version?: string;
	errorNotThrow?: boolean;
}

enum TypeToken {
	USER, GROUP, SERVICE
}

export default SessionConfig;
export { TypeToken }

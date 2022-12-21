import { readFileSync } from "fs";
import GroupSession from "../Session/GroupSession";

const { token } = JSON.parse(readFileSync("./config.json", { encoding: "utf-8" }));


const session = new GroupSession(token, 185903934);
session.createLongPoll()
	.on("message_new", (object) => {
		console.log("[New Message]: ", object.message);
		if (object.message.text == "lol") {
			session.messages.send(object.message.peer_id, "ahahaha");
		}
	})
	.start();

import P from "pino";
import * as path from "path";
import fs from "fs";

import { Boom } from "@hapi/boom";
import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  MessageRetryMap,
  useMultiFileAuthState,
  WAConnectionState,
} from "@adiwajshing/baileys";

const logger = P({ level: "debug" });

export const getCellphoneFromJid = (jid: string): string => {
  return jid.split("@")[0];
};

export const getJidFromCellphone = (cellphone: string): string => {
  return `${cellphone}@s.whatsapp.net`;
};

export type WhatsappPropsPreferences = {
  writingTimeInMs: number;
};
export type WhatsappProps = {
  name: string;
  credentialsPath: string;
  preferences: WhatsappPropsPreferences;
};
export class Whatsapp {
  props: WhatsappProps;
  msgRetryCounterMap: MessageRetryMap = {};
  store: any;
  sock!: ReturnType<typeof makeWASocket>;
  connectionStatus: WAConnectionState = "close";
  constructor(props: WhatsappProps) {
    this.props = props;
    this.store = makeInMemoryStore({ logger });
    if (!fs.existsSync(props.credentialsPath)) {
      fs.mkdirSync(props.credentialsPath, {
        recursive: true,
      });
    }
  }
  getCredentialsPath() {
    return path.join(this.props.credentialsPath, "credentials.json");
  }
  getAuthStatePath() {
    return path.join(this.props.credentialsPath, "baileys_auth_info");
  }

  async startSock() {
    this.store?.readFromFile(this.getCredentialsPath());

    setInterval(() => {
      this.store?.writeToFile(this.getCredentialsPath());
    }, 10_000);

    const { state, saveCreds } = await useMultiFileAuthState(
      this.getAuthStatePath()
    );
    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`);

    const sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: true,
      auth: state,
      msgRetryCounterMap: this.msgRetryCounterMap,
    });

    this.store?.bind(sock.ev);

    // the process function lets you process all events that just occurred
    // efficiently in a batch

    sock.ev.on("connection.update", (event) => {
      const { connection, lastDisconnect } = event;
      if (connection) {
        if (connection === "close") {
          // reconnect if not logged out
          if (
            (lastDisconnect?.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut
          ) {
            this.startSock();
          } else {
            console.log("Connection closed. You are logged out.");
          }
        }
        this.connectionStatus = connection;
      }

      console.log("connection update", event);
    });

    sock.ev.on("creds.update", async () => {
      await saveCreds();
    });

    sock.ev.on("messages.upsert", async (upsert) => {
      console.log("recv messages ", JSON.stringify(upsert, undefined, 2));
    });

    await sock.waitForConnectionUpdate(
      ({ connection }) => connection === "open"
    );
    this.sock = sock;
  }

  private async sendMessageWithTyping(msg: AnyMessageContent, jid: string) {
    try {
      await this.sock.presenceSubscribe(jid);
      await delay(500);

      await this.sock.sendPresenceUpdate("composing", jid);
      await delay(this.props.preferences.writingTimeInMs);

      await this.sock.sendPresenceUpdate("paused", jid);

      await this.sock.sendMessage(jid, msg);
    } catch (err) {
      logger.error(err, "sendMessageWithTyping");
    }
  }
  sendMessage(cellphone: string, msg: AnyMessageContent) {
    const jid = getJidFromCellphone(cellphone);

    return this.sendMessageWithTyping(msg, jid);
  }

  async connect() {
    await this.startSock();
    logger.debug("Whatsapp connected !");
  }
}

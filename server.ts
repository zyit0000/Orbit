import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Net from "net";
import Zlib from "zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function executeOpiumware(Code: string, Port: string) {
    const Ports = ["8392", "8393", "8394", "8395", "8396", "8397"];
    let ConnectedPort = null,
        Stream: Net.Socket | null = null;

    const targetPorts = Port === "ALL" ? Ports : [Port];

    for (const P of targetPorts) {
        try {
            Stream = await new Promise<Net.Socket>((Resolve, Reject) => {
                const Socket = Net.createConnection({
                    host: "127.0.0.1",
                    port: parseInt(P)
                }, () => Resolve(Socket));
                Socket.on("error", Reject);
                Socket.setTimeout(2000);
                Socket.on("timeout", () => {
                    Socket.destroy();
                    Reject(new Error("Connection timeout"));
                });
            });
            ConnectedPort = P;
            break;
        } catch (Err: any) {
            console.log(`Failed to connect to port ${P}: ${Err.message}`);
        }
    }

    if (!Stream || !ConnectedPort) return { success: false, message: "Failed to connect on all ports" };

    if (Code !== "NULL") {
        try {
            await new Promise<void>((Resolve, Reject) => {
                Zlib.deflate(Buffer.from(Code, "utf8"), (Err, Compressed) => {
                    if (Err) return Reject(Err);
                    if (!Stream) return Reject(new Error("Stream lost"));
                    Stream.write(Compressed, (WriteErr) => {
                        if (WriteErr) return Reject(WriteErr);
                        Resolve();
                    });
                });
            });
        } catch (Err: any) {
            Stream.destroy();
            return { success: false, message: `Error sending script: ${Err.message}` };
        }
    }

    Stream.end();
    return { success: true, message: `Successfully connected to Opiumware on port: ${ConnectedPort}`, port: ConnectedPort };
}

async function executeMacSploit(Code: string, Port: string) {
    const Ports = ["5553", "5554", "5555", "5556", "5557", "5558", "5559", "5560", "5561", "5562"];
    let ConnectedPort = null,
        Stream: Net.Socket | null = null;

    const targetPorts = Port === "ALL" ? Ports : [Port];

    for (const P of targetPorts) {
        try {
            Stream = await new Promise<Net.Socket>((Resolve, Reject) => {
                const Socket = Net.createConnection({
                    host: "127.0.0.1",
                    port: parseInt(P)
                }, () => Resolve(Socket));
                Socket.on("error", Reject);
                Socket.setTimeout(2000);
                Socket.on("timeout", () => {
                    Socket.destroy();
                    Reject(new Error("Connection timeout"));
                });
            });
            ConnectedPort = P;
            break;
        } catch (Err: any) {
            console.log(`Failed to connect to port ${P}: ${Err.message}`);
        }
    }

    if (!Stream || !ConnectedPort) return { success: false, message: "Failed to connect on all ports" };

    if (Code !== "NULL") {
        try {
            const encoded = Buffer.from(Code, "utf8");
            const header = Buffer.alloc(16 + encoded.length + 1);
            header.writeUInt8(0, 0); // IPC_EXECUTE
            header.writeInt32LE(encoded.length, 8);
            encoded.copy(header, 16);

            await new Promise<void>((Resolve, Reject) => {
                if (!Stream) return Reject(new Error("Stream lost"));
                Stream.write(header, (WriteErr) => {
                    if (WriteErr) return Reject(WriteErr);
                    Resolve();
                });
            });
        } catch (Err: any) {
            Stream.destroy();
            return { success: false, message: `Error sending script: ${Err.message}` };
        }
    }

    Stream.end();
    return { success: true, message: `Successfully connected to MacSploit on port: ${ConnectedPort}`, port: ConnectedPort };
}

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use(express.json());

    // API routes
    app.post("/api/execute", async (req, res) => {
        const { code, port, executor } = req.body;
        try {
            const result = executor === "MacSploit" 
                ? await executeMacSploit(code, port || "ALL")
                : await executeOpiumware(code, port || "ALL");
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    app.post("/api/attach", async (req, res) => {
        const { executor } = req.body;
        try {
            const result = executor === "MacSploit"
                ? await executeMacSploit("NULL", "ALL")
                : await executeOpiumware("NULL", "ALL");
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();

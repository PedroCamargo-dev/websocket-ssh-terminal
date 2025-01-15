import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { useLocation, useNavigate } from "react-router";
import "@xterm/xterm/css/xterm.css";

const TerminalSSH: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { host, port, username, password, privateKey } = location.state || {};

  useEffect(() => {
    if (!host || !port || !username) {
      navigate("/");
      return;
    }

    term.current = new Terminal();
    fitAddon.current = new FitAddon();

    console.log(terminalRef.current && term.current && fitAddon.current);

    if (terminalRef.current && term.current && fitAddon.current) {
      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);
      fitAddon.current.fit();
    }

    const socket = new WebSocket("ws://localhost:8080/ws");

    socket.onopen = () => {
      const config = {
        host,
        port: parseInt(port),
        username,
        password,
        privateKey,
      };
      socket.send(
        JSON.stringify({ type: "config", content: JSON.stringify(config) })
      );
      term.current?.write(`Connecting to ${host}:${port}...\r\n`);
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data);
      if (message.type === "output") {
        term.current?.write(message.content);
      }
    };

    socket.onerror = (error: Event) => {
      const errorMessage = (error as ErrorEvent).message;
      term.current?.write(`\r\nConnection error: ${errorMessage}\r\n`);
    };

    socket.onclose = () => {
      term.current?.write("\r\nConnection closed.\r\n");
      navigate("/");
    };

    term.current?.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "input", content: data }));
      }
    });

    const handleResize = () => {
      if (fitAddon.current) {
        fitAddon.current.fit();

        const rows = term.current?.rows ?? 0;
        const cols = term.current?.cols ?? 0;

        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "resize", rows, cols }));
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      socket.close();
      term.current?.dispose();
    };
  }, [host, navigate, password, port, privateKey, username]);

  return <div className="h-screen bg-black" ref={terminalRef}></div>;
};

export { TerminalSSH };

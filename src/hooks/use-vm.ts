"use client";

import { ICheerpX } from "@/app/types/cheerpx";
import { useCheerpX } from "@/providers/cheerpx";
import type { FitAddon } from "@xterm/addon-fit";
import type { Terminal } from "@xterm/xterm";
import { useCallback, useRef, useState } from "react";

export const useVm = ({ consoleSelector }: { consoleSelector?: string }) => {
  const cheerpX = useCheerpX();
  const terminalRef = useRef<Terminal | null>(null);
  const onKeyTypeRef = useRef<(keyCode: number) => void>(() => {});
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const writeToTerm = (data: Uint8Array) => {
    console.log(typeof data, data);
    if (!terminalRef.current) return;
    terminalRef.current.write(new Uint8Array(data));
    console.log(new TextDecoder().decode(data));
  };
  const onTermData = (data: string) => {
    console.log(data);
    if (!onKeyTypeRef.current) return;
    for (let i = 0; i < data.length; i++)
      onKeyTypeRef.current(data.charCodeAt(i));
  };

  const onResize = () => {
    if (!fitAddonRef.current) return;
    fitAddonRef.current.fit();
  };

  const init = useCallback(
    async (CheerpX: ICheerpX, terminal: Terminal) => {
      const cloudDevice = await CheerpX.CloudDevice.create(
        "wss://disks.webvm.io/debian_large_20230522_5044875331.ext2"
      );
      // Read-write local storage for disk blocks, it is used both as a cache and as persisteny writable storage
      const idbDevice = await CheerpX.IDBDevice.create("block1");
      // A device to overlay the local changes to the disk with the remote read-only image
      const overlayDevice = await CheerpX.OverlayDevice.create(
        cloudDevice,
        idbDevice
      );
      // Direct acces to files in your HTTP server
      const webDevice = await CheerpX.WebDevice.create("");
      // Convenient access to JavaScript binary data and strings
      const dataDevice = await CheerpX.DataDevice.create();

      const cx = await CheerpX.Linux.create({
        mounts: [
          { type: "ext2", path: "/", dev: overlayDevice },
          { type: "dir", path: "/app", dev: webDevice },
          { type: "dir", path: "/data", dev: dataDevice },
          { type: "devs", path: "/dev" },
        ],
      });

      const consoleEle = consoleSelector
        ? document.querySelector(consoleSelector)
        : null;
      if (consoleEle) {
        cx.setConsole(consoleEle);
      }

      const customConsole = cx.setCustomConsole(
        writeToTerm,
        terminal.cols,
        terminal.rows
      );
      onKeyTypeRef.current = customConsole;

      await cx
        .run("/bin/bash", ["--login"], {
          env: [
            "HOME=/home/user",
            "USER=user",
            "SHELL=/bin/bash",
            "EDITOR=vim",
            "LANG=en_US.UTF-8",
            "LC_ALL=C",
            "TERM=xterm-256color",
          ],
          cwd: "/home/user",
          uid: 1000,
          gid: 1000,
        })
        .then(console.log)
        .catch(console.error);

      setInitialized(true);
      setInitializing(false);
      return cx;
    },
    [consoleSelector]
  );

  const load = async () => {
    if (!cheerpX.loaded) return;
    if ("error" in cheerpX) return;
    const element = consoleSelector
      ? document.querySelector(consoleSelector)
      : null;

    if (!element) return;

    setInitializing(true);

    const { Terminal } = await import("@xterm/xterm");
    const { WebLinksAddon } = await import("@xterm/addon-web-links");
    const { FitAddon } = await import("@xterm/addon-fit");

    const terminal = new Terminal({
      cursorBlink: true,
      convertEol: true,
      fontFamily: "monospace",
      fontWeight: 400,
      fontWeightBold: 700,
    });
    terminal.loadAddon(new WebLinksAddon());
    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    terminal.loadAddon(fitAddon);
    terminalRef.current = terminal;
    terminal.open(element as HTMLElement);
    terminal.focus();
    fitAddon.fit();
    terminal.write("Initializing...\n");
    terminal.onData(onTermData);
    // terminal
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { CheerpX } = cheerpX as any;
    init(CheerpX, terminal);
  };

  return { load, cheerpX, initializing, initialized, onResize };
};

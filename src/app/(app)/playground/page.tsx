"use client";

import { Button } from "@/components/ui/button";
import { useVm } from "@/hooks/use-vm";
import { useEffect } from "react";

const Page = () => {
  const vm = useVm({ consoleSelector: "#console" });

  const hideLoadButton = vm.initializing || vm.initialized;

  useEffect(() => {
    const onResize = () => vm.onResize();

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [vm, vm.onResize]);

  return (
    <div className="grow flex flex-col">
      <div className="min-h-32 grow relative flex flex-col p-3">
        <pre className="grow max-h-[99svh]" id="console"></pre>
        {!vm.initializing && !vm.initialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              className=""
              onClick={vm.load}
              type="button"
              disabled={hideLoadButton}
            >
              Load
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

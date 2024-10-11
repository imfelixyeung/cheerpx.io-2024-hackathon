"use client";

import { useVm } from "@/hooks/use-vm";

const Page = () => {
  const vm = useVm({ consoleSelector: "#console" });

  return (
    <div>
      <pre>
        <code>{JSON.stringify(vm, null, 2)}</code>
      </pre>
      <pre className="border-2 min-h-16">
        <code id="console"></code>
      </pre>
      <button onClick={vm.load} type="button">
        Load
      </button>
    </div>
  );
};

export default Page;

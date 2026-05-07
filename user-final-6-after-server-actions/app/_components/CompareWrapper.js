"use client";

import { useState } from "react";
import CompareBar from "./CompareBar";
import CompareModal from "./CompareModal";

export default function CompareWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <CompareBar onOpen={() => setOpen(true)} />
      {open && <CompareModal onClose={() => setOpen(false)} />}
    </>
  );
}

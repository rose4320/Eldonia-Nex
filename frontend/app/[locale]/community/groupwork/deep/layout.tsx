import React from "react";

import Layout from "@/components/layout/Layout";

export default function DeepGroupworkLayout({ children }: { children: React.ReactNode }) {
  // フッターなしのレイアウト
  return <Layout showFooter={false}>{children}</Layout>;
}

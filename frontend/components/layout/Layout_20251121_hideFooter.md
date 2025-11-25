【2025-11-21 deep配下フッター非表示対応】
- Layout.tsx で deep配下のパス判定により自動的にフッターを非表示にするロジックを追加
- 他ページは従来通りフッター表示
- deep/layout.tsx では showFooter 指定不要
- 今後フッター非表示パスを増やす場合は hideFooterPaths 配列に追加するだけでOK

---

// 主要変更点抜粋

// components/layout/Layout.tsx
const hideFooterPaths = [
  '/community/groupwork/deep',
  '/community/groupwork/deep/'
];
const shouldHideFooter = hideFooterPaths.some(p => pathname.startsWith(p));
...
{(!shouldHideFooter && showFooter) && <Footer {...footerProps} />}

// app/community/groupwork/deep/layout.tsx
import Layout from "@/components/layout/Layout";
export default function DeepGroupworkLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

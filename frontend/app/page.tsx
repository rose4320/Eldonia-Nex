import { redirect } from 'next/navigation'

// ルートアクセス時はデフォルトロケール(ja)へリダイレクト
export default function RootRedirect() {
  redirect('/ja')
}


import { redirect } from 'next/navigation'

interface Props {
  params: { locale: string }
}

export default function LocaleGalleryDashboardRedirect({ params }: Props) {
  const { locale } = params
  redirect(`/${locale}/gallery`)
}


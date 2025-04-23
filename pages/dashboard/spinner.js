import Wheel from '@/components/DashBoard/Wheel';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export default function Home() {
  const { t } = useTranslation('dashboard')
  return (
    <div>
      <Head>
        <title>{t('spinner.title')}</title>
        <meta name='description' content={t('spinner.meta')} />
      </Head>
      <Wheel />
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
    },
  }
}

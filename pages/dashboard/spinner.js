import Wheel from '@/components/DashBoard/Wheel';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Spin the Wheel</title>
        <meta name="description" content="Spin the wheel to win Hubscore!" />
      </Head>
     <Wheel/>
    </div>
  );
}

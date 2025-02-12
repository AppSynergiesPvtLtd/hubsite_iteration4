import Accumulate from "@/components/Home/AccumulateSteps/AccumulateSteps";
import HubsiteSocial from "@/components/Home/HubsiteSocial/HubsiteSocial";
import Newsletter from "@/components/Home/Newsletter/Newsletter";
import Reviews from "@/components/Home/Reviews/Reviews";
import WelcomeBanner from "@/components/Home/WelcomeBanner/WelcomeBanner";
import Image from "next/image";
import Benefits from "@/components/Home/Benefits";
import MainLayout from "@/layouts/MainLayout";
import Whatsapp from "@/layouts/whatsapp";



Home.Layout = MainLayout; 
export default function Home() {
  return (
    <div className="text-black bg-white">
        <WelcomeBanner/>
        <HubsiteSocial/>
        <Benefits/>
        <Accumulate/>
        <Reviews/>
        <Newsletter/>
        <Whatsapp/>
    </div>
    
  );
}

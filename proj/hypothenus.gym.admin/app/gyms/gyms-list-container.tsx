import GymsList from "./gyms-list";
import { Gym } from "@/src//lib/entities/gym";
import { Page } from "@/src//lib/entities/page";
import { getGyms } from "@/app/lib/ssr/gyms-data-service";
import GymsDataProvider from "../lib/contexts/gyms-data-provider";

export default async function GymsListContainer() {

  const pageOfGyms: Page<Gym> = await getGyms(0, 10);

  return (
    <GymsDataProvider pageOfGym={pageOfGyms}>
       <GymsList />
    </GymsDataProvider>
  );
}

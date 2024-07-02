"use client"

import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import GymDetails from "./gym-details";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";

export default function GymsList({ pageOfGyms }: { pageOfGyms: Page<Gym> | undefined; }) {

  //const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [pageOfGyms, setPageOfGyms] = useState<Page<Gym>>();

  /*useEffect(() => {
    const fetchGymsPage = async () => {
      let response = await axiosInstance.post("/api/gyms", {
        pageNumber: pageNumber, pageSize: pageSize
      });

      let pageOfGyms: Page<Gym> = response.data;

  //    setPageOfGyms(pageOfGyms);
    }

    if (isLoading === false) {
      setIsLoading(true);
      fetchGymsPage();
    }
  }, []);
  */


  return (

    <div className="row h-100 w-100 mt-2 mb-2">
      {pageOfGyms?.content.map((gym: Gym) => {
        return <GymDetails key={gym.gymId} gym={gym}></GymDetails>
      })}
    </div>
  );
}
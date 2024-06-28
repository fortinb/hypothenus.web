"use client"

import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import GymDetails from "./gym-details";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
export default function GymsList({ pageNumber, pageSize }: { pageNumber: number, pageSize: number; }) {

  let [isLoading, setIsLoading] = useState<boolean>(false);
  let [pageOfGyms, setPageOfGyms] = useState<Page<Gym>>();

  useEffect(() => {
    const fetchGymsPage = async () => {
      let response = await axiosInstance.post("/api/gyms", {
        pageNumber: pageNumber, pageSize: pageSize
      });

      let pageOfGyms: Page<Gym> = response.data;

      setPageOfGyms(pageOfGyms);
    }

    if (isLoading === false) {
      setIsLoading(true);
      fetchGymsPage();
    }
  }, [pageNumber, pageSize]);

  return (
    <div className="container pb-4">
      <div className="row g-4">
        if (!isLoading) {
          pageOfGyms?.content.map((gym: Gym) => {
            return <GymDetails key={gym.gymId} gym={gym}></GymDetails>
          })}
      </div>
    </div>
  );
}
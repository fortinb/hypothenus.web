"use client"

import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "../lib/components/errors/error-boundary";
import { useAppDispatch } from "../lib/hooks/useStore";
import { GymsPagingState } from "../lib/store/slices/gymsPagingSlice";
import GymsList from "./gyms-list";
import GymsListLoading from "./gyms-list-loading";

export default function GymsListPaging() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging?.value);
  // const searchState: SearchState = useSelector((state: any) => state.search?.value);

  const [pageOfGyms, setPageOfGyms] = useState<Page<Gym>>();
  const [isInitDone, setIsInitDone] = useState<boolean>(false);
  //const [searchCriteria, setSearchCriteria] = useState<String>("");

  //const dispatch = useAppDispatch()

  useEffect(() => {
    if (!isInitDone) {
      fetchGymsPage();

      setIsInitDone(true);
    }
  }, [pageOfGyms]);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (event.currentTarget) {
      const formData = new FormData(event.currentTarget);

      const searchCriteria = formData.get("searchCriteria")?.valueOf()?.toString();
      if (searchCriteria && searchCriteria?.length >= 3) {
        searchGymsPage(searchCriteria.valueOf().toString());
      }
    }
  }

  const fetchGymsPage = async () => {
    let response = await axiosInstance.post("/api/gyms", {
      pageNumber: gymsPagingState.pageNumber, pageSize: gymsPagingState.pageSize
    });

    let pageOfGyms: Page<Gym> = response.data;

    setPageOfGyms(pageOfGyms);
  }

  const searchGymsPage = async (criteria: String) => {
    let response = await axiosInstance.post("/api/gyms/search", {
      criteria: criteria, pageNumber: gymsPagingState.pageNumber, pageSize: gymsPagingState.pageSize
    });

    let pageOfGyms: Page<Gym> = response.data;

    setPageOfGyms(pageOfGyms);
  }

  return (
    <div className="overflow-auto h-100">
      <ErrorBoundary>
         <GymsList pageOfGyms={pageOfGyms} />
      </ErrorBoundary>
    </div>
  );
}
/*    <div className="pt-2">
<Form as="form" className="d-flex" role="search" onSubmit={onSearch}>
<Form.Control type="search" placeholder="Search" name="searchCriteria" defaultValue="" aria-label="Search" />
<Button className="ms-2" type="submit" variant="primary">Search</Button>
</Form>
</div>
*/
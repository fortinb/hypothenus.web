"use client"

import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { useEffect, useState, MouseEvent } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "../lib/components/errors/error-boundary";
import PagingNavigation from "../lib/components/navigation/paging-navigation";
import { GymsPagingState, firstPage, nextPage, previousPage } from "../lib/store/slices/gymsPagingSlice";
import GymsList from "./gyms-list";
import Loader from "../lib/components/navigation/loader";
import { useAppDispatch } from "../lib/hooks/useStore";

export default function GymsListPaging() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging);
  const dispatch = useAppDispatch();

  const [pageOfGyms, setPageOfGyms] = useState<Page<Gym>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchGymsPage(gymsPagingState.pageNumber, gymsPagingState.pageSize);
  }, [gymsPagingState]);
 
  const fetchGymsPage = async (pageNumber: number, pageSize: number) => {
    setIsLoading(true);

    let response = await axiosInstance.post("/api/gyms", {
      pageNumber, pageSize
    });

    let pageOfGyms: Page<Gym> = response.data;

    setPageOfGyms(pageOfGyms);
    if (pageOfGyms?.content && pageOfGyms?.pageable) {
      setTotalPages(pageOfGyms.totalPages);
    }
    setIsLoading(false);
  }

  const onFirstPage = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(firstPage());
  }

  const onPreviousPage = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(previousPage());
  }

  const onNextPage = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    dispatch(nextPage());
  }

  return (
      <ErrorBoundary>
        <div className="d-flex flex-column justify-content-start w-100 h-100">
          <div>
            <PagingNavigation pageNumber={gymsPagingState.pageNumber + 1} totalPages={totalPages}
              onFirstPage={onFirstPage} onPreviousPage={onPreviousPage} onNextPage={onNextPage} />
          </div>

          {isLoading &&
            <div className="flex-fill w-100 h-100">
              <Loader />
            </div>
          }

          {!isLoading &&
            <div className="overflow-auto flex-fill w-100 h-100">
              <GymsList pageOfGyms={pageOfGyms} />
            </div>
          }

        </div>
      </ErrorBoundary>
  );
}

/* 
  const searchGymsPage = async (criteria: String) => {
    let response = await axiosInstance.post("/api/gyms/search", {
      criteria: criteria, pageNumber: gymsPagingState.pageNumber, pageSize: gymsPagingState.pageSize
    });

    let pageOfGyms: Page<Gym> = response.data;

    setPageOfGyms(pageOfGyms);
  }
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

const sleep = (milliseconds: number) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
   await sleep(60000);
      <div className="pt-2">
<Form as="form" className="d-flex" role="search" onSubmit={onSearch}>
<Form.Control type="search" placeholder="Search" name="searchCriteria" defaultValue="" aria-label="Search" />
<Button className="ms-2" type="submit" variant="primary">Search</Button>
</Form>
</div>
*/
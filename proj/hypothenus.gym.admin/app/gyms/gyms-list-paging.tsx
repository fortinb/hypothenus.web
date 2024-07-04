"use client"

import axiosInstance from "@/app/lib/http/axiosInterceptorClient";
import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "../lib/components/errors/error-boundary";
import Loader from "../lib/components/navigation/loader";
import PagingNavigation from "../lib/components/navigation/paging-navigation";
import { useAppDispatch } from "../lib/hooks/useStore";
import { GymsPagingState, firstPage, nextPage, previousPage, resetSearchCriteria, setSearchCriteria, includeInactive } from "../lib/store/slices/gymsPagingSlice";
import GymsList from "./gyms-list";

export default function GymsListPaging() {
  const gymsPagingState: GymsPagingState = useSelector((state: any) => state.gymsPaging);
  const dispatch = useAppDispatch();

  const [pageOfGyms, setPageOfGyms] = useState<Page<Gym>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (gymsPagingState.searchActive) {
      searchGymsPage(gymsPagingState.pageNumber, gymsPagingState.pageSize, gymsPagingState.includeInactive, gymsPagingState.searchCriteria);
    } else {
      fetchGymsPage(gymsPagingState.pageNumber, gymsPagingState.pageSize, gymsPagingState.includeInactive);
    }
    
  }, [gymsPagingState]);
  
  const fetchGymsPage = async (pageNumber: number, pageSize: number, includeInactive: boolean) => {
    setIsLoading(true);

    let response = await axiosInstance.post("/api/gyms", {
      pageNumber, pageSize, includeInactive
    });

    let pageOfGyms: Page<Gym> = response.data;

    setPageOfGyms(pageOfGyms);
    if (pageOfGyms?.content && pageOfGyms?.pageable) {
      setTotalPages(pageOfGyms.totalPages);
    }

    setIsLoading(false);
  }

  const searchGymsPage = async (pageNumber: number, pageSize: number, includeInactive: boolean, criteria: String) => {
    setIsLoading(true);

    let response = await axiosInstance.post("/api/gyms/search", {
      pageNumber, pageSize, includeInactive, criteria
    });

    let pageOfGyms: Page<Gym> = response.data;

    setPageOfGyms(pageOfGyms);

    if (pageOfGyms?.content && pageOfGyms?.pageable) {
      setTotalPages(0); // Force 0 since we don't know the total count of the search
    }

    setIsLoading(false);
  }

  function onSearchInput(e: ChangeEvent<HTMLInputElement> ) {
    e.preventDefault();

    if (e?.currentTarget?.value == "") {
      dispatch(resetSearchCriteria());
    }
  }

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (e.currentTarget) {
      const formData = new FormData(e.currentTarget);

      const searchCriteria = formData.get("searchCriteria")?.valueOf()?.toString() ?? "";
      if (searchCriteria?.length >= 2) {
        dispatch(setSearchCriteria(searchCriteria));
      }
      if (searchCriteria == "") {
        dispatch(resetSearchCriteria());
      }
    }
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
      <div className="d-flex flex-column justify-content-start w-100 h-100 page-part">
        <div>
          <PagingNavigation pageNumber={gymsPagingState.pageNumber + 1} totalPages={totalPages}
            onFirstPage={onFirstPage} onPreviousPage={onPreviousPage} onNextPage={onNextPage}
            onSearch={onSearch} onSearchInput={onSearchInput} />
        </div>
        <div>
          <hr />
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
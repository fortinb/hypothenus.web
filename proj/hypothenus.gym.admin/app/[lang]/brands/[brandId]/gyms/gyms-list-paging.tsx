"use client"

import { Gym } from "@/src/lib/entities/gym";
import { Page } from "@/src/lib/entities/page";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import Loader from "@/app/ui/components/navigation/loader";
import PagingNavigation from "@/app/ui/components/navigation/paging-navigation";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { GymsStatePaging, firstPage, nextPage, previousPage, resetSearchCriteria, setSearchCriteria } from "@/app/lib/store/slices/gyms-state-paging-slice";
import GymsList from "./gyms-list";
import { clearGymState } from "@/app/lib/store/slices/gym-state-slice";
import { fetchGyms, searchGyms } from "@/app/lib/services/gyms-data-service-client";

export default function GymsListPaging({ lang, brandId }: { lang: string; brandId: string }) {
  const gymsStatePaging: GymsStatePaging = useSelector((state: any) => state.gymsStatePaging);
  const dispatch = useAppDispatch();

  const [pageOfGyms, setPageOfGyms] = useState<Page<Gym>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Reset gym state
    dispatch(clearGymState());

    if (gymsStatePaging.searchActive) {
      searchGymsPage(gymsStatePaging.page, gymsStatePaging.pageSize, gymsStatePaging.includeInactive, gymsStatePaging.searchCriteria);
    } else {
      fetchGymsPage(gymsStatePaging.page, gymsStatePaging.pageSize, gymsStatePaging.includeInactive);
    }

  }, [gymsStatePaging]);

  const fetchGymsPage = async (page: number, pageSize: number, includeInactive: boolean) => {
    setIsLoading(true);

   let pageOfGyms: Page<Gym> = await fetchGyms(brandId, page, pageSize, includeInactive);

    setPageOfGyms(pageOfGyms);
    if (pageOfGyms?.content && pageOfGyms?.pageable) {
      setTotalPages(pageOfGyms.totalPages);
    }

    setIsLoading(false);
  }

  const searchGymsPage = async (page: number, pageSize: number, includeInactive: boolean, criteria: String) => {
    setIsLoading(true);

    let pageOfGyms: Page<Gym> = await searchGyms(brandId, page, pageSize, includeInactive, criteria);

    setPageOfGyms(pageOfGyms);

    if (pageOfGyms?.content && pageOfGyms?.pageable) {
      setTotalPages(0); // Force 0 since we don"t know the total count of the search
    }

    setIsLoading(false);
  }

  function onSearchInput(e: ChangeEvent<HTMLInputElement>) {
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
          <PagingNavigation page={gymsStatePaging.page + 1} totalPages={totalPages}
            onFirstPage={onFirstPage} onPreviousPage={onPreviousPage} onNextPage={onNextPage}
            searchActive={true} onSearch={onSearch} onSearchInput={onSearchInput} />
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
            <GymsList lang={lang} brandId={brandId} pageOfGyms={pageOfGyms} />
          </div>
        }

      </div>
    </ErrorBoundary>
  );
}
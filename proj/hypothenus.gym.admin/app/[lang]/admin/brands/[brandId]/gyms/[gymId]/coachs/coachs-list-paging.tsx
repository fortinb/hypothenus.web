"use client"

import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import Loader from "@/app/ui/components/navigation/loader";
import PagingNavigation from "@/app/ui/components/navigation/paging-navigation";
import { CoachsStatePaging, firstPage, nextPage, previousPage } from "@/app/lib/store/slices/coachs-state-paging-slice";
import { Coach } from "@/src/lib/entities/coach";
import { Page } from "@/src/lib/entities/page";
import { MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import CoachsList from "./coachs-list";
import { clearCoachState } from "@/app/lib/store/slices/coach-state-slice";
import { fetchCoachs } from "@/app/lib/services/coachs-data-service-client";

export default function CoachsListPaging({ lang, brandId, gymId }: { lang: string; brandId: string; gymId: string }) {
  const coachsStatePaging: CoachsStatePaging = useSelector((state: any) => state.coachsStatePaging);
  const dispatch = useAppDispatch();

  const [pageOfCoachs, setPageOfCoachs] = useState<Page<Coach>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
    const fetchCoachsPage = async (page: number, pageSize: number, includeInactive: boolean) => {
      setIsLoading(true);

      let pageOfCoachs: Page<Coach> = await fetchCoachs(brandId, gymId, page, pageSize, includeInactive);

      setPageOfCoachs(pageOfCoachs);
      if (pageOfCoachs?.content && pageOfCoachs?.pageable) {
        setTotalPages(pageOfCoachs.totalPages);
      }

      setIsLoading(false);
    }

    // Reset coach state
    dispatch(clearCoachState());

    fetchCoachsPage(coachsStatePaging.page, coachsStatePaging.pageSize, coachsStatePaging.includeInactive);

  }, [dispatch, coachsStatePaging, brandId, gymId]);

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
          <PagingNavigation page={coachsStatePaging.page + 1} totalPages={totalPages}
            onFirstPage={onFirstPage} onPreviousPage={onPreviousPage} onNextPage={onNextPage}
            searchActive={false} />
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
            <CoachsList lang={lang} brandId={brandId} gymId={gymId} pageOfCoachs={pageOfCoachs} />
          </div>
        }

      </div>
    </ErrorBoundary>
  );
}
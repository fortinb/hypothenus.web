"use client"

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
import { GymState } from "@/app/lib/store/slices/gym-state-slice";
import { ActionResult } from "@/app/lib/http/result";
import { useRouter } from "next/navigation";

export default function CoachsListPaging({ lang}: { lang: string; }) {
  const coachsStatePaging: CoachsStatePaging = useSelector((state: any) => state.coachsStatePaging);
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [pageOfCoachs, setPageOfCoachs] = useState<Page<Coach>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
    const fetchCoachsPage = async (page: number, pageSize: number, includeInactive: boolean) => {
      setIsLoading(true);

      let pageOfCoachs: ActionResult<Page<Coach>> = await fetchCoachs(gymState.gym.brandUuid, gymState.gym.uuid, page, pageSize, includeInactive);
      if (pageOfCoachs.ok) {
        setPageOfCoachs(pageOfCoachs.data);
        if (pageOfCoachs.data.content && pageOfCoachs?.data?.pageable) {
          setTotalPages(pageOfCoachs.data.totalPages);
        }
      } else {
        router.push(`/${lang}/error`);
      }

      setIsLoading(false);
    }

    // Reset coach state
    dispatch(clearCoachState());

    fetchCoachsPage(coachsStatePaging.page, coachsStatePaging.pageSize, coachsStatePaging.includeInactive);

  }, [dispatch, coachsStatePaging, gymState]);

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
    <>
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
            <CoachsList lang={lang} pageOfCoachs={pageOfCoachs} />
          </div>
        }

      </div>
    </>
  );
}
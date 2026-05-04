"use client"

import { MembershipPlan } from "@/src/lib/entities/membership-plan";
import { Page } from "@/src/lib/entities/paging/page";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "@/app/ui/components/navigation/loader";
import PagingNavigation from "@/app/ui/components/navigation/paging-navigation";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { MembershipPlansStatePaging, firstPage, nextPage, previousPage, resetSearchCriteria, setSearchCriteria } from "@/app/lib/store/slices/membership-plans-state-paging-slice";
import MembershipPlansList from "./membership-plans-list";
import { clearMembershipPlanState } from "@/app/lib/store/slices/membership-plan-state-slice";
import { fetchMembershipPlans, searchMembershipPlans } from "@/app/lib/services/membership-plans-data-service-client";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { ActionResult } from "@/app/lib/http/result";
import { useRouter } from "next/navigation";

export default function MembershipPlansListPaging({ lang }: { lang: string; }) {
  const membershipPlansStatePaging: MembershipPlansStatePaging = useSelector((state: any) => state.membershipPlansStatePaging);
  const brandState: BrandState = useSelector((state: any) => state.brandState);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [pageOfMembershipPlans, setPageOfMembershipPlans] = useState<Page<MembershipPlan>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchMembershipPlansPage = async (page: number, pageSize: number, includeInactive: boolean) => {
      setIsLoading(true);

      let pageOfMembershipPlans: ActionResult<Page<MembershipPlan>> = await fetchMembershipPlans(brandState.brand.uuid, page, pageSize, includeInactive);
      if (pageOfMembershipPlans.ok) {
        setPageOfMembershipPlans(pageOfMembershipPlans.data);
      } else {
        router.push(`/${lang}/error`);
      }
      
      setIsLoading(false);
    }

    // Reset membershipPlan state
    dispatch(clearMembershipPlanState());

    fetchMembershipPlansPage(membershipPlansStatePaging.page, membershipPlansStatePaging.pageSize, membershipPlansStatePaging.includeInactive);
    
  }, [dispatch, membershipPlansStatePaging, brandState]);

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
          <PagingNavigation page={pageOfMembershipPlans ? pageOfMembershipPlans.pageNumber + 1 : 0} totalPages={pageOfMembershipPlans?.totalPages ?? 0}
            hasPrevious={pageOfMembershipPlans?.hasPrevious ?? false} hasNext={pageOfMembershipPlans?.hasNext ?? false}
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
            <MembershipPlansList lang={lang} pageOfMembershipPlans={pageOfMembershipPlans} />
          </div>
        }

      </div>
    </>
  );
}

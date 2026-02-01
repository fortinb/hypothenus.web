"use client"

import { Member } from "@/src/lib/entities/member";
import { Page } from "@/src/lib/entities/page";
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import Loader from "@/app/ui/components/navigation/loader";
import PagingNavigation from "@/app/ui/components/navigation/paging-navigation";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { MembersStatePaging, firstPage, nextPage, previousPage, resetSearchCriteria, setSearchCriteria } from "@/app/lib/store/slices/members-state-paging-slice";
import MembersList from "./members-list";
import { clearMemberState } from "@/app/lib/store/slices/member-state-slice";
import { fetchMembers, searchMembers } from "@/app/lib/services/members-data-service-client";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";

export default function MembersListPaging({ lang }: { lang: string; }) {
  const membersStatePaging: MembersStatePaging = useSelector((state: any) => state.membersStatePaging);
  const brandState: BrandState = useSelector((state: any) => state.brandState);
  const dispatch = useAppDispatch();

  const [pageOfMembers, setPageOfMembers] = useState<Page<Member>>();
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      const fetchMembersPage = async (page: number, pageSize: number, includeInactive: boolean) => {
        setIsLoading(true);
  
        let pageOfMembers: Page<Member> = await fetchMembers(brandState.brand.uuid, page, pageSize, includeInactive);
  
        setPageOfMembers(pageOfMembers);
        if (pageOfMembers?.content && pageOfMembers?.pageable) {
          setTotalPages(pageOfMembers.totalPages);
        }
  
        setIsLoading(false);
      }
  
      const searchMembersPage = async (page: number, pageSize: number, includeInactive: boolean, criteria: String) => {
        setIsLoading(true);
  
        let pageOfMembers: Page<Member> = await searchMembers(brandState.brand.uuid, page, pageSize, includeInactive, criteria);
  
        setPageOfMembers(pageOfMembers);
  
        if (pageOfMembers?.content && pageOfMembers?.pageable) {
          setTotalPages(0); // Force 0 since we don"t know the total count of the search
        }
  
        setIsLoading(false);
      }
      // Reset member state
      dispatch(clearMemberState());
  
      if (membersStatePaging.searchActive) {
        searchMembersPage(membersStatePaging.page, membersStatePaging.pageSize, membersStatePaging.includeInactive, membersStatePaging.searchCriteria);
      } else {
        fetchMembersPage(membersStatePaging.page, membersStatePaging.pageSize, membersStatePaging.includeInactive);
      }
  
    }, [dispatch, membersStatePaging, brandState]);
  
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
          <PagingNavigation page={membersStatePaging.page + 1} totalPages={totalPages}
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
            <MembersList lang={lang} pageOfMembers={pageOfMembers} />
          </div>
        }

      </div>
    </ErrorBoundary>
  );
}
"use client"

import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { MembershipPlanFilterState, updateGymSelectedItem } from "@/app/lib/store/slices/membership-plans-filter-state-slice";
import { GymSelectedItem } from "@/src/lib/entities/ui/gym-selected-item";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import Select from "react-select";

export default function MembershipMenu({ lang, initialAvailableGymItems, preferredGymUuid }:
  {
    lang: string;
    initialAvailableGymItems: GymSelectedItem[];
    preferredGymUuid: string | null;

  }) {
  const membershipPlanFilterState: MembershipPlanFilterState = useSelector((state: any) => state.membershipPlanFilterState);

  const dispatch = useAppDispatch();
  const t = useTranslations("membership");

  const [availableGymItems] = useState<GymSelectedItem[]>(initialAvailableGymItems);

  useEffect(() => {
    const preferredGymItem = availableGymItems.find(item => item.gym.uuid === preferredGymUuid) ?? (availableGymItems.length > 0 ? availableGymItems[0] : undefined);
    if (preferredGymItem) {
      dispatch(updateGymSelectedItem(preferredGymItem));
    }
  }, [dispatch, availableGymItems, preferredGymUuid]);

  function onGymSelection(gymSelectedItem: GymSelectedItem) {
    dispatch(updateGymSelectedItem(gymSelectedItem));
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-start w-100 h-50">
        <div className="d-flex flex-row justify-content-center">
          <h2 className="text-secondary pt-4 ps-2">{t("menu.title")}
            <i className="icon icon-secondary bi-person-gear m-1"></i>
          </h2>
        </div>
        <div className="ps-2 pe-2">
          <hr />
        </div>
        <div className="d-flex flex-column h-100">
          <Container fluid={true}>
            <div className="d-flex flex-row justify-content-start">
              <div className="d-flex flex-column flex-fill justify-content-start">
                <Select
                  isMulti={false}
                  options={availableGymItems}
                  onChange={(selected) => onGymSelection(selected as GymSelectedItem)}
                  value={membershipPlanFilterState.gymSelectedItem}
                  hideSelectedOptions={true}
                  closeMenuOnSelect={true}
                  placeholder={t("gym.filter.placeholder")}
                  noOptionsMessage={() => t("gym.filter.noOptions")}
                  isClearable={true}
                />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

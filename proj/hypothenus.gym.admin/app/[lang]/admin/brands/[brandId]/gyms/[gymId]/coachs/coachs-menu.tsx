"use client"

import { useGymActions } from "@/app/lib/hooks/useGymActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { Coach } from "@/src/lib/entities/coach";
import { Gym } from "@/src/lib/entities/gym";
import { useTranslations } from "next-intl";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import { assignCoachAction, unassignCoachAction } from "./actions";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Tooltip from "react-bootstrap/Tooltip";
import { MouseEvent, useEffect, useState } from "react";
import { CoachSelectedItem } from "@/src/lib/entities/ui/coach-selected-item";
import Select from "react-select";

export default function CoachsMenu({ lang, initialAvailableCoachItems }:
  {
    lang: string;
    initialAvailableCoachItems: CoachSelectedItem[];
  }) {
  const gymState: GymState = useSelector((state: any) => state.gymState);

  const dispatch = useAppDispatch();
  const t = useTranslations("coach");

  const [availableCoachItems, setAvailableCoachItems] = useState<CoachSelectedItem[]>(initialAvailableCoachItems);
  const [coachOptionItems, setCoachOptionItems] = useState<CoachSelectedItem[]>([]);
  const [selectedCoachToAssign, setSelectedCoachToAssign] = useState<CoachSelectedItem | null>(null);
  const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();
  const { isAssigningCoach, assignCoachToGym, unassignCoachFromGym
  } = useGymActions<Gym>({
    actions: {
      assignCoach: assignCoachAction,
      unassignCoach: unassignCoachAction
    }
  });

  useEffect(() => {
    const coachOptions = availableCoachItems
      .filter((item) => !gymState.gym?.coachs?.some((selected) => selected.uuid === item.coach.uuid))
      .sort((a, b) => a.coach.person.lastname.localeCompare(b.coach.person.lastname));

    setCoachOptionItems(coachOptions);
  }, [gymState.gym, availableCoachItems]);

  const assignCoach = (coach: Coach) => {
    assignCoachToGym(
      gymState.gym, coach.uuid, `/${lang}/admin/brands/${gymState.gym.brandUuid}/gyms/${gymState.gym.uuid}`,
      (entity) => {
        showResultToast(true, t("action.assignationSuccess"));

        setTimeout(function () {
          dispatch(updateGymState(entity));
        }, 300);
      },
      (result) => {
        showResultToast(false, t("action.assignationError"), !result.ok ? result.error?.message : undefined);
      }
    );
  }

  function onAssignCoach(e: MouseEvent<HTMLButtonElement>) {
    if (selectedCoachToAssign) {
      assignCoach(selectedCoachToAssign.coach);
      setSelectedCoachToAssign(null);
    }
  }

  return (
    <>
      <div className="d-flex flex-column justify-content-start w-100 h-50 page-menu">
        <div className="d-flex flex-row justify-content-center">
          <h2 className="text-secondary pt-4 ps-2">{t("list.menu.gym", { name: gymState.gym.name })}</h2>
        </div>
        <div className="d-flex flex-row justify-content-center">
          <h3 className="text-secondary pt-0 ps-2">{t("list.menu.title")}
            <i className="icon icon-secondary bi-person-arms-up m-0"></i>
          </h3>
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
                  options={coachOptionItems}
                  isDisabled={isAssigningCoach}
                  onChange={(selected) => setSelectedCoachToAssign(selected)}
                  value={selectedCoachToAssign}
                  hideSelectedOptions={true}
                  closeMenuOnSelect={true}
                  placeholder={t("coachs.select")}
                  noOptionsMessage={() => t("coachs.noOptions")}
                  isClearable={true}
                />
              </div>
              <div className="d-flex flex-column align-items-center">
                <div className="ms-1">
                  <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="coach_action_assign_tooltip">{t("action.bar.assignTooltip")}</Tooltip>}>
                    <Button aria-label={t("action.bar.assign")} className="btn btn-icon btn-sm" onClick={(e) => onAssignCoach(e)}><i className="icon bi bi-plus h5"></i></Button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
    </>
  );
}

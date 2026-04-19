"use client";

import { useGymActions } from "@/app/lib/hooks/useGymActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import ModalConfirmation from "@/app/ui/components/actions/modal-confirmation";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { Coach } from "@/src//lib/entities/coach";
import { Gym } from "@/src/lib/entities/gym";
import { formatPersonName } from "@/src/lib/entities/contact/person";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import Link from "next/link";
import { MouseEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useSelector } from "react-redux";
import { assignCoachAction, unassignCoachAction } from "./actions";

export default function CoachListDetails({ lang, coach }:
  {
    lang: string;
    coach: Coach;
  }) {
  const t = useTranslations("coach");
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const dispatch = useAppDispatch();

  const [showUnassignConfirmation, setShowUnassignConfirmation] = useState(false);
 
  const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();
  const { isAssigningCoach, assignCoachToGym, unassignCoachFromGym
  } = useGymActions<Gym>({
    actions: {
      assignCoach: assignCoachAction,
      unassignCoach: unassignCoachAction
    }
  });

  const unassignCoach = (coach: Coach) => {
    unassignCoachFromGym(
      gymState.gym, coach.uuid, `/${lang}/admin/brands/${gymState.gym.brandUuid}/gyms/${gymState.gym.uuid}`,
      (entity) => {
        setShowUnassignConfirmation(false);
        showResultToast(true, t("action.unassignationSuccess"));

        setTimeout(function () {
          dispatch(updateGymState(entity));
        }, 300);
      },
      (result) => {
        showResultToast(false, t("action.unassignationError"), !result.ok ? result.error?.message : undefined);
      }
    );
  }

  function onUnassignCoachConfirmation(e: MouseEvent<HTMLButtonElement>) {
    setShowUnassignConfirmation(true);
  }

  function onUnassignCoach(confirmation: boolean) {
    if (confirmation) {
      unassignCoach(coach);
    } else {
      setShowUnassignConfirmation(false);
    }
  }

  return (
    <>
      <Col xs={6} >
        <Card className="mb-2 me-2 card-min-height">
          <Card.Body className={"m-2" + (coach.active == false ? " card-body-inactive" : "")}>
            <div className="d-flex flex-row justify-content-start">
              <div className="d-flex flex-column flex-fill justify-content-start">
                <Card.Title >
                  <Link className="link-element" href={`/${lang}/admin/brands/${coach.brandUuid}/coachs/${coach.uuid}`}> {formatPersonName(coach.person)}</Link>
                </Card.Title>
                <Card.Text>
                  <Link className="link-element" href={`mailto:${coach.person.email}`}>{coach.person.email}</Link><br />

                  {coach.active == false &&
                    <>
                      <span className="font-weight-bold"><i className="bi bi-ban icon icon-danger pe-2"></i>{t("list.details.inactive")}</span><br />
                    </>
                  }
                </Card.Text>
                <Image
                  src={coach.person?.photoUri ? (URL.canParse(coach.person.photoUri) ? coach.person.photoUri : "/images/person.png") : "/images/person.png"}
                  width={100}
                  height={100}
                  alt={`${t("photo.alt")}`}
                />
              </div>
              <div className="d-flex flex-column">
                <div className="p-1">
                  <OverlayTrigger placement="top" overlay={<Tooltip style={{ position: "fixed" }} id="coach_action_unassign_tooltip">{t("action.bar.unassignTooltip")}</Tooltip>}>
                    <Button aria-label={t("action.bar.unassign")} className="btn btn-icon btn-sm" onClick={(e) => onUnassignCoachConfirmation(e)}><i className="icon bi bi-arrow-bar-right h5"></i></Button>
                  </OverlayTrigger>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
      <ModalConfirmation title={t("unassignConfirmation.title", { name: formatPersonName(coach.person) })} text={t("unassignConfirmation.text")}
        yesText={t("unassignConfirmation.yes")} noText={t("unassignConfirmation.no")}
        actionText={t("unassignConfirmation.action")}
        isAction={isAssigningCoach}
        show={showUnassignConfirmation} handleResult={onUnassignCoach} />
    </>
  );
}
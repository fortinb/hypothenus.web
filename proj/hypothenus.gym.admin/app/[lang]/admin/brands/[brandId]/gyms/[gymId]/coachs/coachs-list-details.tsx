"use client";

import { useGymActions } from "@/app/lib/hooks/useGymActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { GymState, updateGymState } from "@/app/lib/store/slices/gym-state-slice";
import { Coach } from "@/src//lib/entities/coach";
import { Gym } from "@/src/lib/entities/gym";
import { formatPersonName } from "@/src/lib/entities/person";
import { useTranslations } from "next-intl";
import Col from "react-bootstrap/Col";
import Image from 'next/image';
import Link from "next/link";
import Card from "react-bootstrap/Card";
import { useSelector } from "react-redux";
import { assignCoachAction, unassignCoachAction } from "./actions";
import ToastResult from "@/app/ui/components/notifications/toast-result";

export default function CoachListDetails({ lang, coach }: { lang: string; coach: Coach }) {
  const t = useTranslations("coach");
  const gymState: GymState = useSelector((state: any) => state.gymState);
  const dispatch = useAppDispatch();

  // Toast Result State
  const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();
  const { isAssignCoach, assignCoachToGym, unassignCoachFromGym
  } = useGymActions<Gym>({
    actions: {
      assignCoach: assignCoachAction,
      unassignCoach: unassignCoachAction
    }
  });

  const assignCoach = (coach: Coach) => {
    assignCoachToGym(
      gymState.gym, coach.uuid, `/${lang}/admin/brands/${gymState.gym.brandUuid}/gyms/${gymState.gym.uuid}`,
      (entity) => {
        dispatch(updateGymState(entity));
        showResultToast(true, t("action.assignationSuccess"));
      },
      (result) => {
        showResultToast(false, t("action.assignationError"), !result.ok ? result.error?.message : undefined);
      }
    );
  }

  const unassignCoach = (coach: Coach) => {
    unassignCoachFromGym(
      gymState.gym, coach.uuid, `/${lang}/admin/brands/${gymState.gym.brandUuid}/gyms/${gymState.gym.uuid}`,
      (entity) => {
        dispatch(updateGymState(entity));
        showResultToast(true, t("action.unassignationSuccess"));
      },
      (result) => {
        showResultToast(false, t("action.unassignationError"), !result.ok ? result.error?.message : undefined);
      }
    );
  }

  function onAssignCoach(coach: Coach) {
    assignCoach(coach);
  }

  function onUnassignCoach(coach: Coach) {
    unassignCoach(coach);
  }

  return (
    <>
      <Col xs={6} >
        <Card className="m-2 card-min-height">
          <Card.Body className={"m-2" + (coach.isActive == false ? " card-body-inactive" : "")}>
            <Card.Title >
              <Link className="link-element" href={`/${lang}/admin/brands/${coach.brandUuid}/coachs/${coach.uuid}`}> {formatPersonName(coach.person)}</Link>
            </Card.Title>
            <Card.Text>
              <Link className="link-element" href={`mailto:${coach.person.email}`}>{coach.person.email}</Link><br />

              {coach.isActive == false &&
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
          </Card.Body>
        </Card>
      </Col>
      <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
    </>
  );
}
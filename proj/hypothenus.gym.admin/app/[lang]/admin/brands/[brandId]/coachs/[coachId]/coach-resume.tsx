"use client"

import { useTranslations } from "next-intl";
import { CoachState } from "@/app/lib/store/slices/coach-state-slice";
import { Contact } from "@/src/lib/entities/contact/contact";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import EmergencyContactDisplay from "@/app/ui/components/contact/emergency-contact-display";

export default function CoachResume() {
  const coachState: CoachState = useSelector((state: any) => state.coachState);
  const t = useTranslations("coach");

  return (

    <div className="d-flex flex-column justify-content-start w-100 h-100 page-menu overflow-auto">
      <div className="d-flex flex-row justify-content-center">
        <h2 className="text-secondary pt-4 ps-2">{t("resume.contacts")}</h2>
      </div>
      <div className="ps-2 pe-2">
        <hr />
      </div>
      <Container fluid={true}>
        {coachState.coach.person.contacts?.map((contact: Contact, index: number) => {

          return (
            <EmergencyContactDisplay key={index} contact={contact} index={index} />
          )
        })}
      </Container>
    </div>
  );
}

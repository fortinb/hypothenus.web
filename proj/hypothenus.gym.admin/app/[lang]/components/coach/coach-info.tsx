"use client"

import { Coach } from "@/src/lib/entities/coach";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PersonInfo from "../person/person-info";

export default function CoachInfo({ coach, isEditMode }:
    {
        coach: Coach,
        isEditMode: boolean
    }) {

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="coach_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="m-2 gx-2">
                    <PersonInfo id="coach_person" formStatefield="person" isEditMode={isEditMode}></PersonInfo>
                </Row>
            </Container>
        </fieldset>
    );
}
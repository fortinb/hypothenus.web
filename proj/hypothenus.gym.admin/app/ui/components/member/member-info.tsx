"use client"

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import PersonInfo from "../person/person-info";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MemberTypeEnum } from "@/src/lib/entities/member";

export default function MemberInfo({ isEditMode, isCancelling, uploadHandler, gyms }:
    {
        isEditMode: boolean,
        isCancelling: boolean,
        uploadHandler: (file: Blob) => void,
        gyms: GymListItem[]
    }) {
    const t = useTranslations("entity");
    const { register, formState: { errors } } = useFormContext();

    return (
        <fieldset className="d-flex flex-column overflow-auto h-100 w-100" form="member_info_form" disabled={!isEditMode} >
            <Container >
                <Row className="mt-2 gx-2">
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor={`member-type-dropdown`}>{t("member.memberType")}</Form.Label>
                            <Form.Select id="member-type-dropdown" defaultValue={MemberTypeEnum.Regular} {...register(`memberType`)}>
                                <option key={MemberTypeEnum.Regular} value={MemberTypeEnum.Regular}>{t("member.types.regular")}</option>
                                <option key={MemberTypeEnum.Premium} value={MemberTypeEnum.Premium}>{t("member.types.premium")}</option>
                                <option key={MemberTypeEnum.Employee} value={MemberTypeEnum.Employee}>{t("member.types.employee")}</option>
                            </Form.Select>
                             {errors?.memberType && <Form.Text className="text-invalid">{t(errors.memberType.message as string)}</Form.Text>}
                         </Form.Group>
                    </Col>
                    <Col xs={6} >
                        <Form.Group>
                            <Form.Label className="text-primary" htmlFor="member-preferred-gym-dropdown">{t("member.preferredGym")}</Form.Label>
                            <Form.Select id="member-preferred-gym-dropdown" defaultValue={gyms.length > 0 ? gyms[0].value : ""} {...register(`preferredGymUuid`)}>
                                {gyms.map((gym) => (
                                    <option key={gym.value} value={gym.value}>{gym.label}</option>
                                ))}
                            </Form.Select>
                             {errors?.preferredGymUuid && <Form.Text className="text-invalid">{t(errors.preferredGymUuid.message as string)}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="m-2 gx-2">
                    <PersonInfo id="member_person" formStatefield="person" isEditMode={isEditMode} isCancelling={isCancelling} uploadHandler={uploadHandler}></PersonInfo>
                </Row>
            </Container>
        </fieldset>
    );
}
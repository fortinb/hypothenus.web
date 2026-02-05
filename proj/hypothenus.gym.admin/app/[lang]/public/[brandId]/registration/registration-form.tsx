"use client"

import { useCrudActions } from "@/app/lib/hooks/useCrudActions";
import { useAppDispatch } from "@/app/lib/hooks/useStore";
import { useToastResult } from "@/app/lib/hooks/useToastResult";
import { ActionResult } from "@/app/lib/http/action-result";
import { BrandState } from "@/app/lib/store/slices/brand-state-slice";
import { MemberState, updateMemberState } from "@/app/lib/store/slices/member-state-slice";
import FormActionButtons from "@/app/ui/components/actions/form-action-buttons";
import ErrorBoundary from "@/app/ui/components/errors/error-boundary";
import MemberRegistration from "@/app/ui/components/member/member-registration";
import ToastResult from "@/app/ui/components/notifications/toast-result";
import { Member, MemberRegistrationSchema, MemberSchema } from "@/src/lib/entities/member";
import { DOMAIN_EXCEPTION_MEMBER_ALREADY_EXIST } from "@/src/lib/entities/messages";
import { phoneNumberOrder } from "@/src/lib/entities/phoneNumber";
import { GymListItem } from "@/src/lib/entities/ui/gym-list-item";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { z } from "zod";
import { createMemberAction } from "./actions";

export default function RegistrationForm({ lang, member, gyms }: { lang: string; member: Member; gyms: GymListItem[] }) {
    const t = useTranslations("entity");
    const router = useRouter();

    const memberState: MemberState = useSelector((state: any) => state.memberState);
    const brandState: BrandState = useSelector((state: any) => state.brandState);
    const dispatch = useAppDispatch();

    // Form state
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [availableGymItems] = useState<GymListItem[]>(gyms);
    const { isSaving, createEntity, saveEntity, activateEntity, deactivateEntity, deleteEntity
    } = useCrudActions<Member>({
        actions: {
            create: createMemberAction,
            save: function (...args: any[]): Promise<ActionResult<Member>> {
                throw new Error("Function not implemented.");
            },
            activate: function (...args: any[]): Promise<ActionResult<Member>> {
                throw new Error("Function not implemented.");
            },
            deactivate: function (...args: any[]): Promise<ActionResult<Member>> {
                throw new Error("Function not implemented.");
            },
            delete: function (...args: any[]): Promise<ActionResult<void>> {
                throw new Error("Function not implemented.");
            }
        }
    });

    const formContext = useForm<z.infer<typeof MemberRegistrationSchema>>({
        defaultValues: mapEntityToForm(member),
        resolver: zodResolver(MemberRegistrationSchema),
    });

    // Toast Result State
    const { resultStatus, showResult, resultText, resultErrorTextCode, showResultToast, toggleShowResult } = useToastResult();

    // Watch the entire form
    // const formData = formContext.watch();

    /*   useEffect(() => {
           // Log the data to the console every time there is an error
           const hasErrors = Object.keys(formContext?.formState?.errors).length > 0
           if (hasErrors) {
               console.log("Current Form errors:", formContext.formState.errors);
           }
   
           // console.log("Current Form Data:", formData);
       }, [formData]);
       */

    useEffect(() => {
        dispatch(updateMemberState(member));
        setIsEditMode(true);
    }, [dispatch, member]);

    const onSubmit: SubmitHandler<z.infer<typeof MemberRegistrationSchema>> = async (formData: z.infer<typeof MemberRegistrationSchema>) => {
        setIsEditMode(false);

        let member: Member = mapFormToEntity(formData, memberState.member);
        createMember(member);
    }

    const createMember = (member: Member) => {
        member.brandUuid = brandState.brand.uuid;

        createEntity(
            member,
            // Before save
            async (entity) => {
                // No before create actions
            },
            // Success
            async (entity) => {
                const duplicate = entity.messages?.find(m => m.code == DOMAIN_EXCEPTION_MEMBER_ALREADY_EXIST)
                if (duplicate) {
                    formContext.setError("person.email", { type: "manual", message: "member.validation.alreadyExists" });
                    showResultToast(false, t("action.saveError"), undefined);
                    setIsEditMode(true);
                } else {
                    dispatch(updateMemberState(entity));
                    showResultToast(true, t("action.saveSuccess"));
                    router.push(`/${lang}/admin/brands/${entity.brandUuid}/members/${entity.uuid}`);
                }
            },
            // Error
            (result) => {
                showResultToast(false, t("action.saveError"), !result.ok ? result.error?.message : undefined);
                setIsEditMode(true);
            }
        );
    }

    function onCancel() {
        setIsEditMode(false);

        formContext.reset(memberState.member);
     
        router.push(`/${lang}/public/${memberState.member.brandUuid}/login`);
    }

    function mapEntityToForm(member: Member): z.infer<typeof MemberRegistrationSchema> {
        const person = { ...member.person };

        // Sort the phoneNumbers array by the predefined order (Business -> Mobile -> Home)
        person.phoneNumbers = [...member.person.phoneNumbers].sort((a, b) => {
            const orderA = phoneNumberOrder[a.type];
            const orderB = phoneNumberOrder[b.type];
            return orderA - orderB;
        });

        return {
            person: person,
            password: "",
            passwordConfirmation: "",
            memberType: member.memberType,
            preferredGymUuid: member.preferredGymUuid
        };
    }

    function mapFormToEntity(formData: z.infer<typeof MemberRegistrationSchema>, member: Member): Member {
        return {
            ...member,  // Preserve original properties like id, isActive, messages, etc.
            person: { ...member.person, ...formData.person },
            memberType: formData.memberType,
            preferredGymUuid: formData.preferredGymUuid
        };
    }

    return (
        <ErrorBoundary>
            <div className="d-flex flex-column justify-content-start w-100 h-100 page-main">
                <div className="ps-2 pe-2">
                    <hr className="mt-0 mb-0" />
                </div>

                <div className="d-flex flex-column justify-content-between w-100 h-100 overflow-hidden ps-2 pe-2">
                    <div className="w-100 h-100">
                        <FormProvider {...formContext} >
                            <Form as="form" className="d-flex flex-column align-items-centerjustify-content-between w-100 h-100 p-2" id="member_info_form" onSubmit={formContext.handleSubmit(onSubmit)}>
                                <div className="d-flex flex-column align-items-center">
                                    <h1 className="text-tertiary">{t("member.header.registration")}</h1>
                                </div>
                                <hr className="mt-1" />
                                <MemberRegistration availableGymItems={availableGymItems} />
                                <hr className="mt-1 mb-1" />
                                <FormActionButtons isSaving={isSaving} isEditMode={isEditMode} onCancel={onCancel} formId="member_info_form" />
                            </Form>

                            <ToastResult show={showResult} result={resultStatus} text={resultText} errorTextCode={resultErrorTextCode} toggleShow={toggleShowResult} />
                        </FormProvider>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
}
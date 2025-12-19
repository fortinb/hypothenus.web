"use client"

import React, { useState } from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useFormContext } from 'react-hook-form';

export interface DualListItem {
    id: string;
    description: () => string;
    source: any;
}

function DualListSelector({ availableItems, formStateField, sourceLabel, selectedLabel, isEditMode, onSelectedItemAdded, onSelectedItemRemoved }:
    {
        availableItems: DualListItem[],
        formStateField: string,
        sourceLabel: string,
        selectedLabel: string,
        isEditMode: boolean,
        onSelectedItemAdded: (item?: DualListItem, addAll?: boolean) => void,
        onSelectedItemRemoved: (index: number, removeAll: boolean) => void
    }) {

    const { watch, formState: { errors } } = useFormContext();

    const [selectedAvailableId, setSelectedAvailableId] = useState<string | null>(null);
    const [selectedChosenId, setSelectedChosenId] = useState<string | null>(null);

    // Convert selected RHF fields into actual stored objects
    const selectedItems = watch(formStateField);

    const moveAvailableToSelected = () => {
        if (!selectedAvailableId) return;
        const item = availableItems.find(i => i.id === selectedAvailableId);
        if (!item) return;

        onSelectedItemAdded(item, false);

        setSelectedAvailableId(null);
    };

    const moveSelectedToAvailable = () => {
        if (!selectedChosenId) return;
        const index = selectedItems.findIndex((i: { id: string; }) => i.id === selectedChosenId);

        if (index >= 0) {
            onSelectedItemRemoved(index, false);
        }
        setSelectedChosenId(null);
    };

    const moveAllAvailableToSelected = () => {
        onSelectedItemAdded(undefined, true);
    };

    const moveAllSelectedToAvailable = () => {
        selectedItems.forEach((_item: DualListItem, index: number) => {
            onSelectedItemRemoved(-1, true);
        });
    };

    return (
        <Container>
            <Row>
                <Col className="d-flex flex-column justify-content-top align-items-center w=100">
                    <Form.Label className="text-primary" >{sourceLabel}</Form.Label>
                    <ListGroup className="w-100">
                        {availableItems.map((item) => (
                            <ListGroup.Item className="list-group-item-action"
                                key={item.id}
                                active={selectedAvailableId === item.id}
                                onClick={() => setSelectedAvailableId(item.id)}
                                disabled={!isEditMode}
                                style={{ cursor: 'pointer' }}>
                                {item.description()}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col xs="auto" className="d-flex flex-column justify-content-center align-items-center h=100">
                    <Button
                        variant="primary"
                        className="mb-2"
                        onClick={moveAvailableToSelected}
                        disabled={!isEditMode}
                    >
                        <i className="icon icon-light bi bi-chevron-right h7"></i>
                    </Button>
                    <Button
                        variant="primary"
                        className="mb-2"
                        onClick={moveAllAvailableToSelected}
                        disabled={!isEditMode}
                    >
                        <i className="icon icon-light bi bi-chevron-double-right h7"></i>
                    </Button>
                    <Button
                        className="mb-2"
                        variant="secondary"
                        onClick={moveAllSelectedToAvailable}
                        disabled={!isEditMode}
                    >
                       <i className="icon icon-light bi bi-chevron-double-left h7"></i>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={moveSelectedToAvailable}
                        disabled={!isEditMode}
                    >
                     <i className="icon icon-light bi bi-chevron-left h7"></i>
                    </Button>

                </Col>
                <Col className="d-flex flex-column justify-content-top align-items-center">
                    <Form.Label className="text-primary" >{selectedLabel}</Form.Label>
                    <ListGroup className="w-100">
                        {selectedItems?.map((item: DualListItem, index: number) => {
                            return <ListGroup.Item className="list-group-item-action"
                                key={item.id}
                                active={selectedChosenId === item.id}
                                onClick={() => setSelectedChosenId(item.id)}
                                disabled={!isEditMode}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.description()}
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Col>
            </Row>
        </Container >
    );

}

export default DualListSelector;

/*
 const onCoachItemAdded = (item?: DualListItem, addAll: boolean = false) => {

        if (!addAll) {
            if (!item) return;
            append(item);
            const updatedAvailableItems = availableCoachItems.filter((i) => i.reference !== item.reference);
            setAvailableCoachItems(updatedAvailableItems);
        }

        if (addAll) {
            availableCoachItems.forEach(item => append(item));
            setAvailableCoachItems([]);
        }
    };

    const onCoachItemRemoved = (index: number, removeAll: boolean = false) => {

        if (!removeAll) {
            if (index < 0) return;

            const item = formContext.getValues(`selectedCoachItems.${index}`);
            if (!item) return;

            // Remove from RHF field array
            remove(index);

            const updatedAvailableItems = [...availableCoachItems, item].sort((a, b) => a.label.localeCompare(b.label));
            setAvailableCoachItems(updatedAvailableItems);
        }

        if (removeAll) {
            const removedItems = formContext.getValues("selectedCoachItems");
            if (removedItems.length > 0) {
                const updatedAvailableItems = [...availableCoachItems, ...removedItems].sort((a, b) => a.label.localeCompare(b.label));
                setAvailableCoachItems(updatedAvailableItems);
            }

            remove();
        }
    };
    
                 <DualListSelector formStateField={formCoachsStateField} isEditMode={isEditMode} onSelectedItemAdded={onCoachItemAdded} onSelectedItemRemoved={onCoachItemRemoved} sourceLabel={t("course.coach.available")} selectedLabel={t("course.coach.selected")} availableItems={availableCoachItems} ></DualListSelector>
                 */ 
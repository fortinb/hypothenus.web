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
            <Row >
                <Col>
                    <div className="d-flex flex-row justify-content-center align-items-center">
                        <Form.Label className="text-primary" >{sourceLabel}</Form.Label>
                    </div>
                </Col>
                 <Col></Col>
                <Col>
                    <div className="d-flex flex-row justify-content-center align-items-center">
                        <Form.Label className="text-primary" >{selectedLabel}</Form.Label>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ListGroup>
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
                <Col xs="auto" className="d-flex flex-column justify-content-top ajlign-items-center">

                    <div className="d-flex flex-column justify-content-center align-items-center h=100">
                        <Button
                            variant="primary"
                            className="mb-2"
                            onClick={moveAllAvailableToSelected}
                            disabled={!isEditMode}
                        >
                            &gt;&gt;
                        </Button>
                        <Button
                            className="mb-2"
                            variant="secondary"
                            onClick={moveAllSelectedToAvailable}
                            disabled={!isEditMode}
                        >
                            &lt;&lt;
                        </Button>
                    </div>
                    <div className="d-flex flex-column flex-fill justify-content-center align-items-center h=100">
                        <Button
                            variant="primary"
                            className="mb-2"
                            onClick={moveAvailableToSelected}
                            disabled={!isEditMode}
                        >
                            &gt;
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={moveSelectedToAvailable}
                            disabled={!isEditMode}
                        >
                            &lt;
                        </Button>
                    </div>
                </Col>
                <Col>
                    <ListGroup >
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
  <Form.Group>
                                    <Form.Control type="text" {...register(`${formStatefield}.${index}`)} value={item.id} />
                                    {item.description()}
                                </Form.Group>

<Form.Group>
                                        <Form.Control
                                            {...register(`${formStatefield}.${index}.description`)}
                                            type="label">

                                        </Form.Control>
                                    </Form.Group>*/ 
"use client"

import React, { useEffect, useState } from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useFormContext, useFieldArray } from 'react-hook-form';

export interface DualListItem {
    id: string;
    description: () => string;
    source: any;
}

function DualListSelector({ sourceItems, sourceLabel, selectedLabel, formStatefield }:
    {
        sourceItems: DualListItem[],
        sourceLabel: string,
        selectedLabel: string,
        formStatefield: string
    }) {

    const { register, formState: { errors } } = useFormContext();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [availableItems, setAvailableItems] = useState<DualListItem[]>([]);
    const [selectedAvailableId, setSelectedAvailableId] = useState<string | null>(null);
    const [selectedChosenId, setSelectedChosenId] = useState<string | null>(null);

    const formItems = useFieldArray({
        name: "dualListSelectedItems",
    });

    useEffect(() => {
        if (isLoading) {
            const initialAvailableItems = sourceItems
                .filter((item) => !formItems.fields.some((selected) => selected.id === item.id))
                .sort((a, b) => a.description().localeCompare(b.description()));
            setAvailableItems(initialAvailableItems);
        }
        // Initialize lists by filtering out selectedItems from sourceItems


        /*  const initialSelectedItems = [...selectedItems].sort((a, b) => a.description.localeCompare(b.description));
          setChosenItems(initialSelectedItems);
          */
    }, [sourceItems]);

    const moveSelectedToChosen = () => {
        if (!selectedAvailableId) return;
        const item = availableItems.find(i => i.id === selectedAvailableId);
        if (!item) return;

        formItems.prepend(item);
        //   formItems.fields.sort((a : Item, b: Item) => a.description.localeCompare(b.description));
        const updatedAvailableItems = availableItems.filter((i) => i.id !== item.id);
        setAvailableItems(updatedAvailableItems);

        /*   const updatedChosenItems = [...chosenItems, item].sort((a, b) => a.description.localeCompare(b.description));
           setChosenItems(updatedChosenItems);
   */
        setSelectedAvailableId(null);
    };

    const moveSelectedToAvailable = () => {
        if (!selectedChosenId) return;
        const item = formItems.fields.find(i => i.id === selectedChosenId);
        if (!item) return;

        /* const updatedChosenItems = chosenItems.filter((i) => i.id !== item.id);
         setChosenItems(updatedChosenItems);
 */
        //   const updatedAvailableItems = [...availableItems, item].sort((a, b) => a.description.localeCompare(b.description));
        //    setAvailableItems(updatedAvailableItems);

        setSelectedChosenId(null);
    };


    return (
        <Container>
            <Row>
                <Col>
                    {sourceLabel}
                    <ListGroup>
                        {availableItems.map((item) => (
                            <ListGroup.Item
                                key={item.id}
                                active={selectedAvailableId === item.id}
                                onClick={() => setSelectedAvailableId(item.id)}
                                style={{ cursor: 'pointer' }}>
                                {item.description()}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
                <Col xs="auto" className="d-flex flex-column justify-content-center align-items-center">
                    <Button
                        variant="primary"
                        className="mb-2"
                        onClick={moveSelectedToChosen}
                        disabled={!selectedAvailableId}
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={moveSelectedToAvailable}
                        disabled={!selectedChosenId}
                    >
                        &lt;
                    </Button>
                </Col>
                <Col>
                    {selectedLabel}
                    <ListGroup>
                        {formItems.fields?.map((item: Record<string, any>, index: number) => {
                            return <ListGroup.Item
                                key={item.id}
                                active={selectedChosenId === item.id}
                                onClick={() => setSelectedChosenId(item.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Form.Group>
                                    <Form.Control
                                        {...register(`${formStatefield}.${index}.id`)}
                                        type="text"
                                    />
                                </Form.Group>
                                {item.description()}
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );

}

export default DualListSelector;
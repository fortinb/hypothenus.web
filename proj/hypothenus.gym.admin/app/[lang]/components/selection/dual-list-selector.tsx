"use client"

import React, { useEffect, useState } from 'react';
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useTranslation } from "@/app/i18n/i18n";
import { FieldError, FieldErrorsImpl, Merge, useFormContext } from "react-hook-form";

interface Item {
    id: string;
    description: string;
    [key: string]: any;  // Placeholder for any additional properties
}

function DualListSelector({ sourceItems, selectedItems, updateSelectedItems  }:
    {
        sourceItems: Item[],
        selectedItems: Item[],
        updateSelectedItems: (selectedItems: Item[]) => void;
    }) {
    const { t } = useTranslation("entity");
    const { register, formState: { errors } } = useFormContext();
    const [availableItems, setAvailableItems] = useState<Item[]>([]);
    const [chosenItems, setChosenItems] = useState<Item[]>([]);
    const [selectedAvailableId, setSelectedAvailableId] = useState<string | null>(null);
    const [selectedChosenId, setSelectedChosenId] = useState<string | null>(null);

    useEffect(() => {
        // Initialize lists by filtering out selectedItems from sourceItems
        const initialAvailableItems = sourceItems
            .filter((item) => !selectedItems.some((selected) => selected.id === item.id))
            .sort((a, b) => a.description.localeCompare(b.description));
        setAvailableItems(initialAvailableItems);

        const initialChosenItems = [...selectedItems].sort((a, b) => a.description.localeCompare(b.description));
        setChosenItems(initialChosenItems);
    }, [sourceItems, selectedItems]);

    const moveSelectedToChosen = () => {
        if (!selectedAvailableId) return;
        const item = availableItems.find(i => i.id === selectedAvailableId);
        if (!item) return;

        const updatedAvailableItems = availableItems.filter((i) => i.id !== item.id);
        setAvailableItems(updatedAvailableItems);

        const updatedChosenItems = [...chosenItems, item].sort((a, b) => a.description.localeCompare(b.description));
        setChosenItems(updatedChosenItems);

        setSelectedAvailableId(null);

        updateSelectedItems(updatedChosenItems); //Callback parent to update selected items
    };

    const moveSelectedToAvailable = () => {
        if (!selectedChosenId) return;
        const item = chosenItems.find(i => i.id === selectedChosenId);
        if (!item) return;

        const updatedChosenItems = chosenItems.filter((i) => i.id !== item.id);
        setChosenItems(updatedChosenItems);

        const updatedAvailableItems = [...availableItems, item].sort((a, b) => a.description.localeCompare(b.description));
        setAvailableItems(updatedAvailableItems);

        setSelectedChosenId(null);

        updateSelectedItems(updatedChosenItems);//Callback parent to update selected items
    };


    return (
        <Container fluid="true">
            <Row>
                <Col>
                    <ListGroup>
                        {availableItems.map((item) => (
                            <ListGroup.Item
                                key={item.id}
                                active={selectedAvailableId === item.id}
                                onClick={() => setSelectedAvailableId(item.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.description}
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
                    <ListGroup>
                        {chosenItems.map((item) => (
                            <ListGroup.Item
                                key={item.id}
                                active={selectedChosenId === item.id}
                                onClick={() => setSelectedChosenId(item.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.description}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );

}

export default DualListSelector;
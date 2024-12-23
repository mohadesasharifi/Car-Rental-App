import React, {useEffect, useState} from 'react';
import {Form, Button, Dropdown} from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import axios from "axios";
import {Slider, Typography} from "@mui/material";
import {FiltersComponentProps, Vehicle} from "../types/Vehicles";
import getApiConfig from "../utils/ApiConfig";
const apiPath = getApiConfig();
const FiltersComponent: React.FC<FiltersComponentProps> = ( {onFiltered }) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [rego, setRego] = useState<string>("");
    const [selectedCommissionedDate, setSelectedCommissionedDate] = useState<string>("");
    const [selectedDecommissionedDate, setSelectedDecommissionedDate] = useState<string>("");
    const [commissionedPeriod, setCommissionedPeriod] = useState<string[]>(["",""]);
    const [decommissionedPeriod, setDecommissionedPeriod] = useState<string[]>(["",""]);
    const [categories, setCategories] = useState<string[]>([]);
    const [odometerRange, setOdometerRange] = useState<number[]>([0, 0]);
    const [selectedOdometerRange, setSelectedOdometerRange] = useState<number[]>([0,0]);
    const [error, setError] = useState<string>("");
    const [regoLabel, setRegoLabel] = useState<string>("Registration Number");
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}`);
            setCategories(response.data.categories||[]);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    }
    const fetchOdometerRange = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}`);
            if (response.data && response.data.odometerRange) {
                const minOdo = Number(response.data.odometerRange[0]);
                const maxOdo = Number(response.data.odometerRange[1]);
                setOdometerRange([minOdo, maxOdo]);
                setSelectedOdometerRange([minOdo, maxOdo]);
            }else {}
        }catch (error) {
            console.error("Error fetching odometerRange", error);
        }
    }
    const fetchCommissionedDate = async () => {

        try {
            const response = await axios.get(`${apiPath.apiPath}`);
            const $date = response.data.commissionedRange || ["", ""];
            console.log("commissioned date", $date);
            setCommissionedPeriod($date);

        }catch(error) {
            console.error("Error fetching odometerRange", error);
        }
     }
    const fetchDecommissionedDate = async () => {

        try {
            const response = await axios.get(`${apiPath.apiPath}`);
            const $date = response.data.decommissionedRange|| ["", ""];
            console.log("decommissioned date", $date);
            setDecommissionedPeriod($date);

        }catch(error) {
            console.error("Error fetching odometerRange", error);
        }
    }

    useEffect(() => {
        fetchCategories();
        fetchOdometerRange();
        fetchCommissionedDate();
        fetchDecommissionedDate();
    },[]);

    const handleRego = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputRego = event.target.value;
        console.log(inputRego);
        setRego(inputRego);
        // Validate registration number (alphanumeric)
        const isValid = /^[a-zA-Z0-9]*$/.test(inputRego);
        if (!isValid) {
            setRegoLabel('Only alphanumeric characters allowed');
            setError('Only alphanumeric characters allowed');
        } else {
            setRegoLabel('Registration Number');
            setError('');
        }

    }
    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };
    const handleCommissionDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        console.log(selectedDate);
        //selectedDate is string in format of year-
        setSelectedCommissionedDate(selectedDate);
    }
    const handleDeCommissionDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        console.log(selectedDate);
        //selectedDate is string in format of year-
        setSelectedDecommissionedDate(selectedDate);
    }
    const handleOdometerChange = (event: Event, newValue: number | number[]) => {
        const selectedRange = newValue as number[];
        setSelectedOdometerRange(selectedRange);
    }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onFiltered({
            rego_no: rego || "",  // Ensure to provide a default value
            min_odometer: selectedOdometerRange[0],
            max_odometer: selectedOdometerRange[1],
            commissioned_since: selectedCommissionedDate,
            decommissioned_since: selectedDecommissionedDate,
            categories: selectedCategories||[]
        });
        console.log("from filter on filter function: ", onFiltered)
        // Perform validation here and set error if needed
    };
    return (
        <Container fluid="md" className="filtersContainer">
            <Form onSubmit={handleSubmit}>
            <Row style={{ alignItems: 'stretch' }}>
                <Col>
                    <Form.Group controlId="formBasicSearch">
                    <Form.Text>{regoLabel}</Form.Text>
                    <Form.Control
                        type="text"
                        placeholder="rego_no..."
                        onChange = {handleRego}
                        isInvalid={!!error}
                        />
                    </Form.Group>


                    <Form.Group controlId="formBasicCategory">
                        <Form.Text>Select One/More</Form.Text>
                        <Dropdown>
                            <Dropdown.Toggle style={{
                                backgroundColor: 'white', // Set background color to white
                                borderColor: '#ced4da', // Keep the default border color
                                color: 'inherit', // Inherit text color
                                padding: '0.375rem 0.75rem', // Use default padding
                                textAlign: 'left', // Align text to the left
                                width: '100%'
                            }}
                                             id="dropdown-basic">
                                Vehicles Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {categories.map((type) => (
                                    <Dropdown.Item key={type} as="div" onClick={() => handleCategoryChange(type)}>
                                        <Form.Check
                                            type="checkbox"
                                            id={`dropdown-checkbox-${type}`}
                                            label={type}
                                            checked={selectedCategories.includes(type)}
                                            onChange={() => handleCategoryChange(type)}
                                        />
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formBasicCommissionedDate">
                        <Form.Text>Commissioned since:</Form.Text>
                        <Form.Control
                            min={commissionedPeriod.length ? commissionedPeriod[0] : undefined}
                            max={commissionedPeriod.length ? commissionedPeriod[1] : undefined}
                            type="date"
                            onChange = {handleCommissionDate}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicDecommissionedDate">
                        <Form.Text>Decommissioned since:</Form.Text>
                        <Form.Control
                            min={decommissionedPeriod.length ? decommissionedPeriod[0] : undefined}
                            max={decommissionedPeriod.length ? decommissionedPeriod[1] : undefined}
                            type="date"
                            onChange = {handleDeCommissionDate}
                        />
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Text>Choose odometer range:</Form.Text>
                    <Slider
                        value={selectedOdometerRange}
                        onChange={handleOdometerChange}
                        valueLabelDisplay="auto"
                        min={Number(odometerRange[0])}
                        max={Number(odometerRange[1])}

                    />
                    <Row>
                        <Col>
                            <Form.Group controlId="minOdometer">
                                <Form.Text>Min</Form.Text>
                                <Form.Control
                                    type="number"
                                    value={selectedOdometerRange[0]}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= odometerRange[0] && value <= selectedOdometerRange[1]) {
                                            const newRange = [value, selectedOdometerRange[1]];
                                            setSelectedOdometerRange(newRange);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const value = Number(e.target.value);
                                        if (value < odometerRange[0]) {
                                            setSelectedOdometerRange([odometerRange[0], selectedOdometerRange[1]]);
                                        } else if (value > selectedOdometerRange[1]) {
                                            setSelectedOdometerRange([selectedOdometerRange[1], selectedOdometerRange[1]]);
                                        }
                                    }}
                                    placeholder="Min Odometer"
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="maxOdometer">
                                <Form.Text>Max</Form.Text>
                                <Form.Control
                                    type="number"
                                    value={selectedOdometerRange[1]}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value <= odometerRange[1] && value >= selectedOdometerRange[0]) {
                                            const newRange = [selectedOdometerRange[0], value];
                                            setSelectedOdometerRange(newRange);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const value = Number(e.target.value);
                                        if (value > odometerRange[1]) {
                                            setSelectedOdometerRange([selectedOdometerRange[0], odometerRange[1]]);
                                        } else if (value < selectedOdometerRange[0]) {
                                            setSelectedOdometerRange([selectedOdometerRange[0], selectedOdometerRange[0]]);
                                        }
                                    }}
                                    placeholder="Max Odometer"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            style={{
                            padding: '7px 30px',
                            fontSize: '18px',
                            marginLeft: '30px',
                            marginTop: '55px',
                            color: '#FFFFFF', // Setting text color to white for contrast

                            border: 'none', // Optional: removes border for a cleaner look
                            cursor: 'pointer', // Changes cursor to a pointer on hover
                            transition: '0.3s', // Adds a smooth transition on hover effects
                        }}>
                            Filter
                        </Button>
                    </Form.Group>

                </Col>
            </Row>
        </Form>

        </Container>
    );
};


export default FiltersComponent;

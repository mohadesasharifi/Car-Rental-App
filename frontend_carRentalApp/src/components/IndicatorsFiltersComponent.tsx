import React, { useEffect, useState } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import { IndicatorsFiltersComponentProps } from "../types/Vehicles";
import getApiConfig from "../utils/ApiConfig";

const IndicatorsFiltersComponent: React.FC<IndicatorsFiltersComponentProps> = ({ onFiltered }) => {
    const apiPath = getApiConfig();
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStartDate, setSelectedStartDate] = useState<string>("");
    const [selectedEndDate, setSelectedEndDate] = useState<string>("");
    const [categories, setCategories] = useState<string[]>([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${apiPath.apiPath}`);
            console.log("Categories response:", response.data); // Log the response
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleStartDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedStartDate(event.target.value);
    };

    const handleEndDate = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEndDate(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Filters submitted:", {
            commissioned_since: selectedStartDate,
            decommissioned_since: selectedEndDate,
            categories: selectedCategories || []
        });
        onFiltered({
            start_day: selectedStartDate,  // Updated to match the expected property name
            end_day: selectedEndDate,      // Updated to match the expected property name
            categories: selectedCategories || []
        });
    };

    return (
        <Container fluid="md" className="filtersContainer">
            <Form onSubmit={handleSubmit}>
                <Row style={{ alignItems: 'stretch' }}>
                    <Col>
                        <Form.Group controlId="formBasicCategory">
                            <Form.Text>Select One/More</Form.Text>
                            <Dropdown>
                                <Dropdown.Toggle style={{
                                    backgroundColor: 'white',
                                    borderColor: '#ced4da',
                                    color: 'inherit',
                                    padding: '0.375rem 0.75rem',
                                    textAlign: 'left',
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
                            <Form.Text>Start day:</Form.Text>
                            <Form.Control
                                type="date"
                                onChange={handleStartDate}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicDecommissionedDate">
                            <Form.Text>End day:</Form.Text>
                            <Form.Control
                                type="date"
                                onChange={handleEndDate}
                            />
                        </Form.Group>
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
                                    color: '#FFFFFF',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: '0.3s',
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

export default IndicatorsFiltersComponent;

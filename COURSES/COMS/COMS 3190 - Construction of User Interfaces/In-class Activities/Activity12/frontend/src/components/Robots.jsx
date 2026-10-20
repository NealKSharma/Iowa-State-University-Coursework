// Author: Neal Kaushik Sharma
// ISU Netid: nea1@iastate.edu
// Date: Apr 25th, 2026

import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Container } from "react-bootstrap";

const Robots = () => {
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        getRobots();
    }, []);

    function getRobots() {
        fetch("http://127.0.0.1:8080/listRobots")
            .then((response) => response.json())
            .then((data) => {
                setRobots(data);
            })
            .catch((error) => {
                console.error("Error fetching Robots:", error);
            });
    }

    return (
        <>
            <div>
                <Container>
                    <h1>Robots</h1>
                    <Row
                        xs={1}
                        md={2}
                        lg={3}
                        className="g-4 d-flex flex-row align-items-stretch"
                    >
                        {robots.map((robot) => (
                            <Col key={robot.id}>
                                <Card>
                                    <Card.Img
                                        variant="top"
                                        src={robot.imageUrl}
                                        style={{ height: "350px" }}
                                        alt={robot.name}
                                    />
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: "18px" }}>
                                            {robot.name}
                                        </Card.Title>
                                        <Card.Text style={{ color: "#000000" }}>
                                            <strong>Price:</strong> ${robot.price}
                                        </Card.Text>
                                        <Card.Text style={{ color: "#000000" }}>
                                            <strong>Cast:</strong>
                                            {robot.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Robots;
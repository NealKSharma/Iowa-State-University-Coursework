// Author: Neal Kaushik Sharma
// ISU Netid: nea1@iastate.edu
// Date: Apr 25th, 2026

import React, { useState } from "react";
import Robots from "./components/Robots";
import AddRobots from "./components/AddRobots";
import UpdateRobot from "./components/UpdateRobot";
import DeleteRobot from "./components/DeleteRobot";
import { Container, Row, Col, ButtonGroup, Button } from "react-bootstrap";

const App = () => {
  const [activeComponent, setActiveComponent] = useState("robots");

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <ButtonGroup>
            <Button
              variant={
                activeComponent === "robots" ? "primary" : "outline-primary"
              }
              onClick={() => setActiveComponent("robots")}
            >
              View Robots
            </Button>
            <Button
              variant={
                activeComponent === "add" ? "success" : "outline-success"
              }
              onClick={() => setActiveComponent("add")}
            >
              Add Robot
            </Button>
            <Button
              variant={
                activeComponent === "update" ? "warning" : "outline-warning"
              }
              onClick={() => setActiveComponent("update")}
            >
              Update Robot
            </Button>
            <Button
              variant={
                activeComponent === "delete" ? "danger" : "outline-danger"
              }
              onClick={() => setActiveComponent("delete")}
            >
              Delete Robot
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          {activeComponent === "robots" && <Robots />}
          {activeComponent === "add" && <AddRobots />}
          {activeComponent === "update" && <UpdateRobot />}
          {activeComponent === "delete" && <DeleteRobot />}
        </Col>
      </Row>
    </Container>
  );
};

export default App;
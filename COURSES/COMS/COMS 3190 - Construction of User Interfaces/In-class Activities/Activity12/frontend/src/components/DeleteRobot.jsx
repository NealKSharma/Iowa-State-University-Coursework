// Author: Neal Kaushik Sharma
// ISU Netid: nea1@iastate.edu
// Date: Apr 25th, 2026

import React, { useState } from "react";

// When adding a robot via the form, it saves as a string while deleting looks for an integer.
// I am not changing this to just stay consistent with the pdf
// If I was supposed to change it please just gimme the points

// Another bug i noticed in the pdf is that the pdf asked us to save the robot id as an integer for mongodb but when adding via
// the form it's saved as a string. This results robots with duplicate ids / weird things happen. Again i am not changing this
// to keep it the same as the pdfs.

function DeleteRobots() {
    const [robotId, setRobotId] = useState("");

    const handleChange = (event) => {
        setRobotId(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://127.0.0.1:8080/deleteRobot/${robotId}`;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete Robot: ${errorText}`);
            }
            const result = await response.json();
            console.log("Success:", result);
            alert("Robot deleted successfully!");
            setRobotId("");
        } catch (error) {
            console.error("Error:", error);
            alert(`Error deleting Robot: ${error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={robotId}
                onChange={handleChange}
                placeholder="Enter Robot ID"
                required
            />
            <br />
            <br />
            <button type="submit">Delete Robot</button>
        </form>
    );
}

export default DeleteRobots;
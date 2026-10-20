// Author: Neal Kaushik Sharma
// ISU Netid: nea1@iastate.edu
// Date: Apr 25th, 2026

import React, { useState } from "react";

const AddRobots = () => {
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        price: "",
        description: "",
        imageUrl: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = "http://127.0.0.1:8080/addRobots";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Failed to add new Robot");
            }
            const result = await response.json();
            console.log("Success:", result);
            alert("Robot added successfully!");
            setFormData({
                id: "",
                name: "",
                price: "",
                description: "",
                imageUrl: "",
            });
        } catch (error) {
            console.error("Error:", error);
            alert("Error adding Robot");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    placeholder="ID"
                    required
                />{" "}
                <br /> <br />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Robot Name"
                    required
                />
                <br /> <br />
                <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Robot Price"
                    required
                />
                <br /> <br />
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Robot Description"
                    required
                />
                <br /> <br />
                <textarea
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Robot Image URL"
                    required
                />
                <br /> <br />
                <button type="submit">Add Robot</button>
            </form>
        </>
    );
};

export default AddRobots;
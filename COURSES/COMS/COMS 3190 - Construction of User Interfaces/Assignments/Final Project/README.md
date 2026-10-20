# AH_17

## Saint Cy's Hospital Management Website

## Team Members

- Neal Sharma - nea1@iastate.edu
- Devank Uppal - duppal@iastate.edu

## Project Description

Saint Cy's Hospital Management Website is a full-stack hospital management web application for COMS 3190 at Iowa State University.

The website lets patients, doctors, pharmacists, and admins use one system for hospital related tasks. Patients can manage their dashboard, health details, notifications, prescriptions, and appointments. Doctors can manage appointment requests and view patient information. Pharmacists can manage medications and assignments. Admins can manage users and system data.

This project builds on our older hospital management idea from COM S 3090, but this version is rebuilt as a React web app with a Node.js, Express, and MongoDB backend.

## Tech Stack

Frontend:
- React with Vite
- JavaScript
- Tailwind CSS for layout
- CSS for styling

Backend:
- Node.js
- Express
- MongoDB Atlas
- JWT authentication
- bcryptjs
- dotenv

## Setup Instructions

1. Clone the repository.

2. Install frontend dependencies.

   cd frontend
   npm install

3. Install backend dependencies.

   cd backend
   npm install

4. Create a .env file in the backend folder.

   MONGODB_URI=mongodb_connection_string
   JWT_SECRET=jwt_secret
   PORT=5050
   CLIENT_ORIGIN=http://localhost:5173

5. Start the backend.

   node server.js

6. Start the frontend.

   npm run dev

The frontend runs on http://localhost:5173 and the backend runs on http://localhost:5050.

## Current Features

- Home page
- Login and signup
- Patient dashboard
- Appointments
- Doctor portal
- Pharmacy page
- Admin panel
- Notifications
- Health details
- Password update
- Error logging

## Known Limitations

- Payment processing is simulated and does not connect to a real payment service.
- Appointment availability is simplified and does not connect to an outside scheduling system.
- Notifications are shown inside the app and are not sent by email or text message.
# AH_17 - Aethera Airways

## Team Members

- Name: Neal Kaushik Sharma
  Email: nea1@iastate.edu

- Name: Devank Uppal 
  Email: duppal@iastate.edu

## Project Overview

Aethera Airways is a single page airline booking application built for COMS 3190 Assignment 3.

The app allows users to create an account, log in, search for flights, view flight details, select seats by class, complete a mock payment, receive a confirmation number, and look up a booking later using the confirmation number and last name.

## Tech Stack

Frontend:
- React
- React Router
- Tailwind CSS

Backend:
- Node.js
- Express
- MongoDB

## Database

**Database name:**

aethera_airways

**Collections used:**

Users, Flights, Bookings

## Setup Instructions

### Backend

Go into the backend folder:

cd backend

Install dependencies:

npm install

Start the backend server:

node server.js

### Frontend

Go into the frontend folder:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

Open the localhost link shown in the terminal.

## MongoDB Setup

Make sure MongoDB is running locally, or add a `.env` file inside the backend folder with:

MONGODB_URI=mongodb_connection_string

If no `.env` file is used, the backend connects to:

mongodb://127.0.0.1:27017/aethera_airways

## Notes

- All flights must include ORD as either the origin or destination.
- Payment is simulated
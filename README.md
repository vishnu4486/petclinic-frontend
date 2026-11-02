# PetClinic Receptionist Frontend

A responsive veterinary receptionist application built using **React, TypeScript, Vite, and Material UI**, integrated with the existing Spring PetClinic REST API.

The application provides a unified workflow for managing pet owners, pets, and veterinary visits.

## Technology Stack

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| React 19              | Frontend UI                   |
| TypeScript            | Type safety                   |
| Vite                  | Development and build tooling |
| Material UI           | UI components                 |
| React Hook Form       | Form management               |
| Zod                   | Form validation               |
| Axios                 | REST API integration          |
| Vitest                | Unit testing                  |
| React Testing Library | Component testing             |

## Features

### Owner Management

- Search owners by last name
- Paginated owner listing
- Register new owners
- View owner details
- Edit owner information

### Pet Management

- View pets belonging to an owner
- Add new pets
- Edit pet information
- Select pets to view their details

### Visit Management

- View visit history for a selected pet
- Register new veterinary visits
- Validate visit date and description

### User Experience

- Responsive Material UI interface
- Reusable components and forms
- Loading indicators
- API error handling with retry support
- Empty-state messages
- Success and error notifications

## Project Structure

```text
src/
├── components/
│   └── common/
├── features/
│   ├── owners/
│   ├── pets/
│   ├── visits/
│   └── reception/
├── hooks/
├── services/
├── test/
└── types/
```

The application follows a feature-based architecture to improve maintainability, reusability, and separation of concerns.

## Prerequisites

- Node.js compatible with Vite 8
- npm
- Spring PetClinic REST backend

## Installation

Clone or download the project, then install dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:9966/petclinic
```

The frontend automatically appends `/api` when making REST requests.

## Running the Application

First, start the Spring PetClinic REST backend.

Backend Swagger UI:

http://localhost:9966/petclinic/swagger-ui/index.html

Then start the frontend:

```bash
npm run dev
```

Open the application at:

http://localhost:5173/

## Available Commands

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run preview`  | Preview production build |
| `npm run lint`     | Run ESLint               |
| `npm run test`     | Run tests in watch mode  |
| `npm run test:run` | Execute all tests once   |

## Testing

The project uses **Vitest and React Testing Library**.

Unit tests have been written for:

- Reusable UI components
- Owner, Pet, and Visit Zod validation schemas
- Owner API service
- Pet API service
- Pet Types API service
- Visit API service
- API error normalization

Run all tests:

```bash
npm run test:run
```

## Production Build

Generate the production build:

```bash
npm run build
```

The generated files will be available in the `dist` directory.

## Architecture and Design Principles

- **Component reusability:** Shared buttons, tables, pagination, dialogs, loading states, and error states.
- **Feature-based organization:** Owner, Pet, Visit, and Reception modules.
- **Custom hooks:** Separate state management and business logic from presentation components.
- **Type safety:** TypeScript interfaces and Zod schemas.
- **Centralized API integration:** Shared Axios client and error normalization.
- **Maintainability:** DRY principles and separation of concerns.

## Backend Integration

The application consumes the existing Spring PetClinic REST API.

No backend modifications are required.

## Assignment Scope

The application supports the receptionist workflow of finding or creating an owner, managing the owner's pets, reviewing visit history, and registering new visits.

## Notes

The Spring PetClinic backend must be running for live API operations.

Automated tests use mocked API requests and can run independently of the backend.

## License

Developed as a frontend technical assignment.

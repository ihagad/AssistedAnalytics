# Assisted Analytics Frontend

A React-based frontend for data analysis with CSV upload, diagnostics, and interactive notebook capabilities.

## Features

- **Data Upload Page**: Upload CSV files and get instant diagnostics
- **Notebook Page**: Jupyter-like interface with interactive cells and chat assistant
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (CSV parsing, diagnostics)
└── App.tsx          # Main app component with routing
```

## Technologies

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- PapaParse (CSV parsing)
- Lucide React (Icons)

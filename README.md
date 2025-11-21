# Horizon Retention & Success Hub

A comprehensive student success and early intervention system for Horizon University. This platform empowers academic advisors and students through predictive analytics and coordinated support services.

## Features

### For Advisors
- **Dashboard Analytics**: Real-time overview of student population with risk metrics
- **Student Management**: Search, filter, and monitor individual student progress
- **Risk Assessment**: ML-powered risk predictions based on multiple factors
- **Intervention Tracking**: Document and track advising notes and interventions
- **Reporting Tools**: Generate comprehensive reports on student outcomes

### For Students
- **Personal Dashboard**: View academic progress, GPA trends, and course performance
- **Course Tracking**: Monitor grades, attendance, and LMS engagement
- **Progress Visualization**: Track degree completion and academic milestones
- **Support Resources**: Access tutoring, career services, and counseling
- **Advisor Contact**: Connect with academic advising services

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: shadcn-ui component library
- **Styling**: Tailwind CSS for responsive design
- **Data Visualization**: Recharts for interactive charts and graphs
- **Routing**: React Router for navigation
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd horizon-retention-hub
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Application pages/routes
├── services/        # API and data services
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── data/            # CSV data files
└── lib/             # Utility functions
```

## Data Sources

The system integrates data from multiple sources:
- Student demographics and enrollment
- Course grades and academic performance
- Attendance records
- LMS engagement metrics
- Financial aid information
- ML-generated risk predictions

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

© 2024 Horizon University. All rights reserved.

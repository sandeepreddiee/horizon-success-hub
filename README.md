# Horizon University Student Success Platform

A comprehensive academic advising and student success tracking platform built for higher education institutions.

## Overview

This platform provides tools for academic advisors and students to monitor academic progress, identify at-risk students, and facilitate timely interventions. The system analyzes multiple data points including GPA, attendance, LMS activity, and financial aid status to provide actionable insights.

## Features

### For Advisors
- **Student Dashboard**: Comprehensive overview of all students with risk assessment
- **Individual Student Profiles**: Detailed academic history, attendance records, and intervention tracking
- **Alert System**: Automated notifications for at-risk students
- **Notes & Interventions**: Document meetings, interventions, and action plans
- **Analytics & Reports**: Data-driven insights on student success patterns

### For Students
- **Academic Progress Tracking**: Monitor GPA trends and course performance
- **Personalized Alerts**: Receive notifications about academic concerns
- **Resource Access**: Quick access to tutoring, counseling, and financial aid resources
- **Advisor Communication**: Direct messaging and appointment scheduling

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Data Visualization**: Recharts & Chart.js
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd horizon-university-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── RiskBadge.tsx   # Risk level indicator
│   ├── StatCard.tsx    # Statistics display card
│   └── ...
├── pages/              # Application pages
│   ├── Login.tsx
│   ├── AdvisorDashboard.tsx
│   ├── StudentDashboard.tsx
│   └── ...
├── services/           # API and data services
│   ├── api.ts          # API client configuration
│   ├── dataLoader.ts   # CSV data processing
│   └── dataCache.ts    # Data caching layer
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── data/               # Sample datasets (CSV)
```

## Data Model

The platform processes multiple data sources:
- **Student Profiles**: Demographics, major, enrollment status
- **Academic Records**: Term GPAs, course enrollments, grades
- **Attendance**: Class participation tracking
- **LMS Events**: Learning management system activity
- **Financial Aid**: Scholarship and aid disbursements
- **Risk Scores**: Calculated risk assessments
- **Advising Notes**: Intervention documentation

## Risk Calculation

Students are assigned risk tiers (Low, Medium, High) based on:
- **GPA (60% weight)**: Academic performance indicator
- **Attendance (40% weight)**: Class participation rate

## Authentication

The platform supports role-based access control:
- **Advisors**: Full access to student data and intervention tools
- **Students**: Personal academic data and resources

Default credentials (development):
- Advisor: `advisor@horizonu.edu` / `advisor123`
- Student: `student@horizonu.edu` / `student123`

## Performance Optimizations

- Data preloading on application startup
- React Query caching with 5-minute stale time
- Component memoization for frequently rendered elements
- Optimized CSV parsing with browser-side caching
- Skeleton loaders for improved perceived performance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/enhancement`)
5. Open a Pull Request

## License

Copyright © 2024 Horizon University. All rights reserved.

## Support

For technical support or questions, contact the development team at dev@horizonu.edu

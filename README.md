# NomadPal Frontend

A modern React-based frontend application for NomadPal, a digital nomad city recommendation platform. Built with React 18, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **City Discovery**: Browse and search cities worldwide with detailed information
- **Personalized Recommendations**: AI-powered city suggestions based on user preferences
- **Advanced Filtering**: Filter cities by climate, budget, safety, and more
- **Pagination**: Efficient pagination system for large datasets
- **Responsive Design**: Mobile-first design that works on all devices

### User Experience
- **Authentication System**: Secure login/registration with JWT tokens
- **User Profiles**: Manage personal preferences and saved cities
- **Real-time Search**: Instant search with debounced input
- **Interactive UI**: Modern, intuitive interface with smooth animations
- **Dark/Light Mode**: Theme support (coming soon)

### Technical Features
- **State Management**: Redux Toolkit for global state management
- **Caching**: In-memory caching for improved performance
- **Error Handling**: Comprehensive error handling with user feedback
- **Loading States**: Skeleton loaders and loading indicators
- **Responsive Grid**: CSS Grid layout for optimal city card display

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + Custom CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom component library
- **Build Tool**: Vite
- **Package Manager**: npm

## 📁 Project Structure

```
NomadPal_Frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CityCard.jsx   # City display component
│   │   ├── BudgetFilter.jsx # Budget filtering component
│   │   ├── Modal.jsx      # Modal dialog component
│   │   └── Navbar.jsx     # Navigation component
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.js     # Authentication hook
│   │   ├── useCities.js   # Cities data management
│   │   ├── useJobs.js     # Jobs data management
│   │   └── useUser.js     # User data management
│   ├── pages/             # Page components
│   │   ├── Cities.jsx     # Cities listing page
│   │   ├── CityDetail.jsx # Individual city page
│   │   ├── Home.jsx       # Landing page
│   │   ├── Login.jsx      # Authentication page
│   │   └── Profile.jsx    # User profile page
│   ├── services/          # API service layer
│   │   ├── apiClient.js   # HTTP client configuration
│   │   ├── auth.service.js # Authentication API
│   │   ├── cities.service.js # Cities API
│   │   └── user.service.js # User API
│   ├── store/             # Redux store configuration
│   │   ├── index.js       # Store setup
│   │   ├── hooks.js       # Redux hooks
│   │   └── slices/        # Redux slices
│   │       ├── authSlice.js # Authentication state
│   │       ├── citiesSlice.js # Cities state
│   │       └── userSlice.js # User state
│   ├── validations/       # Form validation schemas
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite build configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NomadPal_Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001
   VITE_APP_NAME=NomadPal
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Build & Deploy
npm run build        # Create production build
npm run deploy       # Deploy to production
```

## 🔧 Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_APP_NAME`: Application name
- `VITE_ENVIRONMENT`: Environment (development/production)

### Tailwind CSS
The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

### Vite Configuration
Build and development configuration is in `vite.config.js`.

## 🏗️ Architecture

### Component Architecture
- **Atomic Design**: Components follow atomic design principles
- **Container/Presentational**: Separation of logic and presentation
- **Custom Hooks**: Reusable logic extraction
- **Context Providers**: Global state and theme management

### State Management
- **Redux Toolkit**: Global application state
- **Local State**: Component-specific state with useState
- **Server State**: API data management with custom hooks
- **Caching**: In-memory caching for performance

### Data Flow
1. User interaction triggers action
2. Action dispatched to Redux store
3. Store updates trigger component re-renders
4. API calls made through service layer
5. Response data cached and stored in Redux
6. UI updates with new data

## 🔌 API Integration

### Service Layer
- **RESTful API**: Standard REST endpoints
- **Authentication**: JWT token-based auth
- **Error Handling**: Centralized error handling
- **Request/Response**: Axios interceptors for common operations

### Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/cities/*` - Cities data endpoints
- `/api/users/*` - User management endpoints
- `/api/jobs/*` - Job-related endpoints

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Consistent color scheme
- **Typography**: Readable font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components

### Responsive Design
- **Mobile First**: Mobile-optimized design
- **Breakpoints**: Tailwind CSS breakpoints
- **Grid System**: Flexible CSS Grid layout
- **Touch Friendly**: Mobile-optimized interactions

### Accessibility
- **Semantic HTML**: Proper HTML structure
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard support
- **Color Contrast**: WCAG compliant colors

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User journey testing
- **Performance Tests**: Load time optimization

### Running Tests
```bash
npm run test         # Run all tests
npm run test:watch   # Watch mode for development
npm run test:coverage # Coverage report
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Cloud hosting
- **Docker**: Containerized deployment

### Environment Setup
1. Set production environment variables
2. Build the application
3. Deploy to hosting platform
4. Configure CDN and caching

## 🔒 Security

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Secure Storage**: HttpOnly cookies for tokens
- **Route Protection**: Protected route components

### Data Protection
- **HTTPS Only**: Secure communication
- **Input Validation**: Client-side validation
- **XSS Protection**: Content Security Policy
- **CSRF Protection**: Cross-site request forgery prevention

## 📊 Performance

### Optimization Strategies
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Component lazy loading
- **Image Optimization**: Optimized image loading
- **Caching**: In-memory and browser caching

### Monitoring
- **Bundle Analysis**: Webpack bundle analyzer
- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Error boundary implementation
- **Analytics**: User behavior tracking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes and test
4. Submit pull request
5. Code review and merge

### Code Standards
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety (future)
- **Conventional Commits**: Commit message format

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: GitHub issues for bug reports
- **Discussions**: GitHub discussions for questions
- **Email**: Contact the development team

### Common Issues
- **Build Errors**: Check Node.js version and dependencies
- **API Errors**: Verify backend service is running
- **Styling Issues**: Check Tailwind CSS configuration
- **Performance**: Use browser dev tools for analysis

## 🔮 Roadmap

### Upcoming Features
- **Dark Mode**: Theme switching capability
- **Offline Support**: Service worker implementation
- **PWA**: Progressive web app features
- **Internationalization**: Multi-language support
- **Advanced Filters**: More filtering options
- **User Reviews**: City rating system

### Technical Improvements
- **TypeScript**: Full TypeScript migration
- **Testing**: Comprehensive test coverage
- **Performance**: Bundle size optimization
- **Accessibility**: WCAG 2.1 compliance
- **SEO**: Search engine optimization

---

**NomadPal Frontend** - Empowering digital nomads to find their perfect city! 🌍✈️
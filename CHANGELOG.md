# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-17

### Added
- Initial release of GrowMore platform
- User authentication system with JWT
- Role-based access control (Startup, Investor, Admin)
- Startup profile creation and management
- Investor profile with preferences
- AI-powered matching system using FastAPI
- Weighted scoring algorithm (Industry, Budget, Stage, Keywords)
- Modern gradient UI design with Tailwind CSS
- Investor dashboard with:
  - AI match recommendations
  - Browse startups functionality
  - Watchlist feature
  - KPI cards
- Startup dashboard with:
  - AI investor recommendations
  - Funding proposals tracking
  - Create startup form
  - Analytics overview
- File upload support for pitch decks and logos
- MongoDB integration for data persistence
- RESTful API with Express.js
- FastAPI-based AI service with automatic documentation
- Responsive design for mobile and desktop

### Security
- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration
- Environment variable management

### Documentation
- Comprehensive README with setup instructions
- API documentation
- Contributing guidelines
- Code of conduct
- License (MIT)

## [Unreleased]

### Planned Features
- Real-time messaging between startups and investors
- Video pitch integration
- Advanced analytics dashboard
- Mobile applications (iOS/Android)
- Payment gateway integration
- Document signing integration
- Multi-language support
- Email notification system
- Advanced search filters
- Export data functionality

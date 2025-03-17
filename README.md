# Sanction Guard Front-End

## Overview
Sanction Guard is a compliance tool designed to help organizations screen against sanctions lists and perform regulatory checks. This repository contains the front-end code for the Sanction Guard application, providing a user interface for sanctions screening, compliance monitoring, and risk management.

## Features
- Real-time sanctions screening against multiple global watchlists
- User-friendly dashboard for compliance monitoring
- Interactive risk assessment tools
- Case management for potential matches
- Detailed audit trails for compliance documentation
- Customizable screening parameters and thresholds
- Responsive design for desktop and mobile access

## Technology Stack
- React.js for UI components
- Redux for state management
- Material UI for component library
- Axios for API requests
- Chart.js for data visualization
- Jest and React Testing Library for testing

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or Yarn (v1.22.0 or higher)

### Installation
1. Clone the repository
```bash
git clone https://github.com/Sanction-Guard/Sanction-Guard-Front-End.git
cd Sanction-Guard-Front-End
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration details.

4. Start the development server
```bash
npm start
# or
yarn start
```

## Configuration
The application can be configured using environment variables:
- `REACT_APP_API_URL`: URL of the Sanction Guard API
- `REACT_APP_AUTH_DOMAIN`: Authentication domain
- `REACT_APP_AUTH_CLIENT_ID`: Authentication client ID

## Available Scripts
- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run lint`: Runs the linter to check code quality
- `npm run format`: Formats code using Prettier

## Testing
We use Jest and React Testing Library for unit and integration tests. Run the test suite with:
```bash
npm test
```

## Deployment
Instructions for deploying to various environments:

### Production
```bash
npm run build
```
The build artifacts will be stored in the `build/` directory, ready to be deployed to a web server.

### Docker
```bash
docker build -t sanction-guard-frontend .
docker run -p 80:80 sanction-guard-frontend
```

## Integration with Back-End
This front-end application communicates with the Sanction Guard back-end API. See the [API documentation](https://github.com/Sanction-Guard/Sanction-Guard-API) for details on available endpoints and request formats.

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Code Style
We follow the Airbnb JavaScript Style Guide. Code formatting is enforced using ESLint and Prettier.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support and questions, please open an issue in the GitHub repository or contact the development team at support@sanctionguard.com.

## Acknowledgements
- OpenSanctions for providing sanctions data
- All our contributors and users for their valuable feedback

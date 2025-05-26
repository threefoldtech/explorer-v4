# Grid4 Dashboard

A lightweight frontend application to display farm and node information from the Grid4 API.

## Overview

Grid4 Dashboard is a simple, lightweight web application built with vanilla HTML, CSS, and JavaScript. It provides an intuitive interface for exploring farms and nodes on the Grid4 network across different environments (development, QA, test, and production).

## Features

- **Environment Switching**: Easily switch between different Grid4 environments (dev4, qa4, test4, prod4)
- **Farms Management**:
  - List all farms with pagination
  - Search farms by name or ID
  - View detailed farm information
- **Nodes Management**:
  - List all nodes with pagination
  - Search nodes by ID, farm ID, or status
  - View detailed node information including resources and interfaces
- **Dashboard Statistics**:
  - Total number of farms
  - Total number of nodes
  - Total resources (CPU, Memory, SSD Storage, HDD Storage)
- **Responsive Design**: Works on desktop and mobile devices

## Screenshots

(Screenshots would be added here)

## API Integration

The application integrates with the Grid4 Registrar API:

- Farms API: `https://registrar.[env].grid.tf/api/v1/farms`
- Nodes API: `https://registrar.[env].grid.tf/api/v1/nodes`

Where `[env]` can be:
- `dev4` - Development environment
- `qa4` - QA environment
- `test4` - Test environment
- `prod4` - Production environment (default)

## Project Structure

```
grid4-dashboard/
├── index.html              # Home page
├── farms.html              # Farms listing page
├── farm-details.html       # Farm details page
├── nodes.html              # Nodes listing page
├── node-details.html       # Node details page
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   ├── api.js              # API service
│   ├── main.js             # Main JavaScript file
│   ├── farms.js            # Farms page logic
│   ├── farm-details.js     # Farm details page logic
│   ├── nodes.js            # Nodes page logic
│   └── node-details.js     # Node details page logic
└── README.md               # This file
```

## Getting Started

### Prerequisites

- A modern web browser
- A local web server (optional for development)

### Running Locally

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/grid4-dashboard.git
   cd grid4-dashboard
   ```

2. Start a local web server:
   ```
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Usage

### Home Page

The home page provides an overview of the Grid4 network with statistics cards showing:
- Total number of farms
- Total number of nodes
- Total resources (CPU, Memory, SSD Storage, HDD Storage)

### Farms Page

- View a list of all farms
- Search for farms by name or ID
- Click on a farm to view detailed information

### Farm Details Page

- View detailed information about a specific farm
- See a list of nodes associated with the farm

### Nodes Page

- View a list of all nodes
- Search for nodes by ID, farm ID, or status
- Click on a node to view detailed information

### Node Details Page

- View detailed information about a specific node
- See resource information (CPU, memory, storage)
- View network interfaces

## Environment Switching

Use the environment selector in the top-right corner to switch between different Grid4 environments:
- Development (dev4)
- QA (qa4)
- Test (test4)
- Production (prod4) - Default

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Grid4 API Team for providing the backend services
- All contributors to this project

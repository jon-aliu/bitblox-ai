# BitBlox AI Project Suggester

https://ai.bitblox.at

A Next.js web application that helps students discover projects they can build with their BitBlox electronic modules. The application uses AI-powered natural language processing to match user's module inventory with available projects.

## Features

- **Natural Language Input**: Describe your BitBlox modules in plain English
- **Smart Module Recognition**: Automatically detects module names and quantities from text
- **Project Matching**: Finds perfect matches and near matches based on your inventory
- **Missing Parts Detection**: Shows exactly what additional modules you need for near matches
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Client-Side Processing**: All logic runs in the browser - no server required

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bitblox-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Describe Your Modules**: Enter your BitBlox modules in the text area using natural language
   - Examples: "2 motors, 1 controller, 3 lights"
   - Examples: "I have a temperature sensor and 2 LED blox"

2. **Get Suggestions**: Click "Suggest Projects" to analyze your inventory

3. **Review Results**: 
   - **Perfect Matches**: Projects you can build with your current modules
   - **Near Matches**: Projects you can build with just a few additional modules

## Supported Modules

The application recognizes 20 different BitBlox modules:

- **Controllers**: Microcontroller
- **Sensors**: Light, Temperature, Moisture, Distance, Motion, Color, Accelerometer, Humidity, Force/Pressure, IR, Voice Command
- **Outputs**: LED Blox, Display, Sound, Motor
- **Drivers**: Motor Driver
- **Inputs**: Button/Switch
- **Power**: Power Blox
- **Communication**: Connectivity

## Project Database

The application includes 10 sample projects ranging from beginner to advanced:

1. **Four-Wheel Vehicle with Headlights** (Beginner)
2. **Light Sensitive Alarm** (Beginner)
3. **Smart Plant Monitor** (Intermediate)
4. **Voice-Controlled Robot** (Advanced)
5. **Automatic Door Opener** (Intermediate)
6. **Weather Station** (Intermediate)
7. **Color Sorting Machine** (Advanced)
8. **Gesture-Controlled Light** (Intermediate)
9. **Smart Security System** (Advanced)
10. **Interactive Music Box** (Beginner)

## Technical Details

### Architecture

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **State Management**: React hooks
- **Processing**: Client-side JavaScript

### Key Functions

- `extractModulesFromText()`: Parses natural language input to extract module names and quantities
- `recommendProjects()`: Matches user inventory against project requirements
- `generateAIResponse()`: Creates formatted HTML output for display

### Module Recognition

The system uses:
- Regular expressions to find quantity patterns
- Alias matching for natural language variations
- Fuzzy matching for module names

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
bitblox-ai/
├── app/
│   ├── layout.tsx      # Root layout with Tailwind CSS
│   └── page.tsx        # Main application component
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── next.config.js      # Next.js configuration
└── README.md          # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please open an issue on the GitHub repository. # bitblox-ai
# bitblox-ai

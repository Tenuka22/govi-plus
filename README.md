# Govi Plus

Govi Plus is a comprehensive agricultural management system designed to help farmers optimize their farming operations. This system provides tools for managing farms, tracking crop cycles, monitoring weather conditions, and more.

## Features

- **Farmer Management**: Track farmer information, including contact details and farming preferences.
- **Farm Management**: Manage farm details, including location, area, and ownership type.
- **Land Parcel Management**: Track individual land parcels within farms, including soil type and drainage information.
- **Crop Variety Management**: Manage different crop varieties, including growth periods and characteristics.
- **Crop Cycle Tracking**: Track crop cycles, including planting dates, expected harvest dates, and yield data.
- **Growth Stage Monitoring**: Monitor growth stages of crops, including health status and observations.
- **Yield Prediction**: Predict crop yields based on various factors.
- **Weather Data Tracking**: Track weather data, including temperature, humidity, and rainfall.
- **Market Price Tracking**: Track market prices for different crops.
- **Farmer Query Management**: Manage queries from farmers, including subject, description, and status.
- **Alert Management**: Manage alerts for farmers, including type, severity, and related entities.
- **Knowledge Base**: Access a knowledge base for best practices, pest control, and other agricultural topics.
- **Irrigation Schedule Management**: Manage irrigation schedules, including scheduled dates and irrigation data.
- **Pest and Disease Record Management**: Track pest and disease records, including severity and treatment records.
- **Resource Management**: Manage resources, including seeds, fertilizers, and equipment.
- **Resource Usage Tracking**: Track resource usage, including planned and actual usage.

## Getting Started

To get started with Govi Plus, follow these steps:

1. **Install Dependencies**: Install the required dependencies using the following command:

   ```bash
bun install
```

2. **Database Setup**: Set up the database by following the instructions in the [Database Setup](#database-setup) section.

3. **Run the Application**: Start the application using the following command:

```bash
bun dev
```

4. **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to access the application.

## Database Setup

Govi Plus uses Drizzle ORM for database management. To set up the database, follow these steps:

2. **Apply Schema to Database**: Apply the schema to the database using the following command:

   ```bash
   bun db:push
```

## Project Structure

The project structure is organized as follows:

```
govi-plus/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Effect HTTP API on top of Hono)
```

## Available Scripts

- `bun dev`: Start all applications in development mode.
- `bun build`: Build all applications.
- `bun dev:web`: Start only the web application.
- `bun dev:server`: Start only the server.
- `bun check-types`: Check TypeScript types across all apps.
- `bun db:push`: Push schema changes to the database.
- `bun db:studio`: Open the database studio UI.
- `bun db:local`: Start the local SQLite database.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.


# Subscription Billing Simulator

A comprehensive Node.js application that simulates subscription billing with support for multiple currencies, AI-powered campaign analysis, and automated charge processing.

## Features

- 🚀 **Multi-Currency Support**: Convert and process payments in various currencies
- 🤖 **AI Campaign Analysis**: OpenAI-powered campaign description analysis with fallback support
- ⏰ **Flexible Billing Intervals**: Support for minute, daily, weekly, monthly, and yearly subscriptions
- 💳 **Automated Charge Processing**: Background service that processes charges based on subscription intervals
- 📊 **Transaction Tracking**: Complete transaction history and subscription management
- 🐳 **Docker Support**: Containerized deployment ready
- 🔄 **Real-time Processing**: Automatic charge processing every 5 seconds

## Supported Billing Intervals

- **Minute**: Charges every minute
- **Daily**: Charges every 24 hours
- **Weekly**: Charges every 7 days
- **Monthly**: Charges every 30 days
- **Yearly**: Charges every 365 days

## Supported Currencies

The application supports multiple currencies with automatic conversion to USD for normalization. Check the `currencyService.js` for the complete list of supported currencies.

## API Endpoints

### Subscriptions

#### Create Subscription
```http
POST /subscriptions
Content-Type: application/json

{
  "donorId": "donor123",
  "amount": 25.00,
  "currency": "USD",
  "interval": "monthly",
  "campaignDescription": "Support our environmental initiative"
}
```

#### Get All Subscriptions
```http
GET /subscriptions
```

#### Delete Subscription
```http
DELETE /subscriptions/:donorId
```

### Transactions

#### Get All Transactions
```http
GET /transactions
```

## Installation

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshachotaliya/subscription-billing-simulator-.git
   cd subscription-billing-simulator-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_GEMINI_API_KEY_here
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start the production server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t subscription-billing-simulator .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 -e GEMINI_API_KEY=your_key_here subscription-billing-simulator
   ```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | OpenAI API key for campaign analysis | No | Uses fallback analysis |
| `PORT` | Server port | No | 3000 |



## Example Usage

### Creating a Monthly Subscription
```bash
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "donor001",
    "amount": 50.00,
    "currency": "EUR",
    "interval": "monthly",
    "campaignDescription": "Support our educational programs"
  }'
```

### Getting All Subscriptions
```bash
curl http://localhost:3000/subscriptions
```

### Getting Transaction History
```bash
curl http://localhost:3000/transactions
```

## Development

### Available Scripts

- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm run build`: Install dependencies

## License

ISC License

## Support

For issues and questions, please create an issue in the GitHub repository.

---
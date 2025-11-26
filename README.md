# Degen Minter

## Description
Degen Minter is a Bitcoin Ordinals inscription minting application built with Next.js and React. Create your Decentralized Gentleman NFTs on the Bitcoin blockchain with ease!

## Features
- **UniSat Wallet Integration**: Connect your Bitcoin wallet seamlessly
- **Image Compression**: Automatic image optimization to meet size requirements (200kb-400kb)
- **Custom Fee Rates**: Adjust transaction fee rates for faster or more economical confirmations
- **Real-time Cost Calculation**: See inscription costs instantly via Skrybit API
- **Degent Club Branding**: Powered by [Degent Club](https://degent.club)

## Installation
To install the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd degen-minter
npm install
```

## Environment Setup
Create a `.env.local` file in the root directory with the following:

```bash
NEXT_PUBLIC_AUTH_TOKEN=your_skrybit_api_token_here
```

Get your API token from [Skrybit](https://skrybit.io). This token is required for the inscription API to work.

## Usage
To run the application in development mode, use:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

**Note:** Make sure you have set up the `NEXT_PUBLIC_AUTH_TOKEN` environment variable before running the app, otherwise inscription calculations will fail.

To build the application for production, use:

```bash
npm run build
```

To start the production server, use:

```bash
npm start
```

## Creating Your Decentralized Gentleman

### Image Requirements:
- Must be Pepe in a tuxedo
- Bowtie is **mandatory**
- Must include text: "DEGEN", "DEGENT", or "REGEN"
- Final file size must be between 200kb-400kb (automatic compression available)

### How to Generate:
1. Use any AI image generator (ChatGPT, Midjourney, etc.)
2. Download the sample image (Degen.jpg) from the app as reference
3. Use the prompt: "Make one like this"
4. Upload your image to the app - it will automatically compress if needed
5. Adjust the fee rate based on your urgency
6. Connect your UniSat wallet and mint!

## Docker
To run the application using Docker, ensure you have Docker installed, then use:

```bash
docker-compose up --build
```

This will build the image and start the application on port 3000.

## Technology Stack
- **Framework**: Next.js 14.2.5
- **UI Library**: React 18.3.1
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Image Processing**: browser-image-compression
- **HTTP Client**: Axios
- **Wallet Integration**: UniSat Wallet
- **API**: Skrybit Ordinals API

## Project Structure
```
├── app/
│   └── page.tsx          # Main application page
├── components/
│   ├── WalletConnect.tsx # Wallet connection UI
│   ├── AIInstructions.tsx # Image creation instructions
│   ├── FileUpload.tsx    # File upload interface
│   ├── FileValidation.tsx # File validation & compression
│   ├── MintButton.tsx    # Minting interface with fee controls
│   ├── QualitySlider.tsx # Image quality adjustment
│   └── StatusDisplay.tsx # Transaction status display
├── lib/
│   ├── api.ts           # Skrybit API integration
│   └── wallet.ts        # UniSat wallet integration
└── public/
    ├── icon.jpg         # Degen icon
    ├── icon_flipped.jpg # Flipped degen icon
    └── Degen.jpg        # Sample Degent image
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for discussion.

For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Links
- [Degent Club](https://degent.club)
- [UniSat Wallet](https://unisat.io)
- [Skrybit API](https://skrybit.com)

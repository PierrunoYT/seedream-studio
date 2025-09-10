# Seedream Studio

Welcome to Seedream Studio, a Next.js application that provides a user interface for image generation using various AI providers.

## Features

*   **Multiple Providers**: Supports FAL AI, WavespeedAI, and Replicate for image generation.
*   **Multiple Modes**: 
    *   **Generate**: Generate images from a text prompt.
    *   **Edit**: Edit existing images using a text prompt.
    *   **Sequential Edit**: Apply edits to a series of images (WavespeedAI only).
    *   **Sequential Generate**: Generate a series of related images from a single prompt (WavespeedAI only).
*   **Image History**: View and reuse previously generated images.
*   **Drag and Drop**: Easily upload images for editing.
*   **Provider-Specific Guides**: Get tips and examples for each provider to get the best results.

## Getting Started

First, you'll need to create a `.env.local` file in the root of the project and add your API keys for the services you want to use. You can get your API keys from the following websites:

*   [FAL AI](https://fal.ai/)
*   [WavespeedAI](https://wavespeed.ai/)
*   [Replicate](https://replicate.com/)

```bash
FAL_API_KEY=your_fal_api_key
WAVESPEED_API_KEY=your_wavespeed_api_key
REPLICATE_API_KEY=your_replicate_api_key
```

Next, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `.next` folder.
*   `npm run start`: Starts a Next.js production server.
*   `npm run lint`: Runs ESLint to find and fix problems in your code.

## Supported Providers

| Provider | Text-to-Image | Image Edit | Sequential Edit | Sequential Generate | File Upload |
| --- | --- | --- | --- | --- | --- |
| FAL AI | ✔️ | ✔️ | ❌ | ❌ | ✔️ |
| WavespeedAI | ✔️ | ✔️ | ✔️ | ✔️ | ✔️ |
| Replicate | ✔️ | ✔️ | ❌ | ❌ | ✔️ |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](httpss://nextjs.org/docs/deployment) for more details.

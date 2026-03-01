# VCompGuide Backend

This is the backend service for the VCompGuide project. It is built using the [NestJS](https://nestjs.com/) framework and utilizes a variety of powerful third-party APIs for AI, mapping, weather, and media storage.

## 🚀 Features & Tech Stack

This project is built with TypeScript and relies on several key technologies and integrations:

* **Core Framework:** NestJS (`@nestjs/core`, `@nestjs/common`).
* **Database:** MongoDB object modeling using Mongoose (`@nestjs/mongoose`, `mongoose`).
* **Authentication & Security:** Token-based authentication using Passport and JWT (`@nestjs/jwt`, `passport-jwt`), with password hashing via `bcrypt`.
* **AI Integrations:**
    * Google Gemini AI (`@google/generative-ai`).
    * HuggingFace Inference API (`@huggingface/inference`).
* **Location Services:** Google Maps API integration (`@googlemaps/google-maps-services-js`).
* **Weather Services:** OpenWeather API integration.
* **Media Management:** File uploads and cloud storage via Cloudinary (`cloudinary`, `streamifier`).
* **API Documentation:** OpenAPI/Swagger integration (`@nestjs/swagger`).

## 🛠️ Prerequisites

Make sure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (Project is configured for standard Node.js environments)
* npm or Yarn package manager
* A running MongoDB instance 

## ⚙️ Environment Variables

Before running the application, you must configure your environment variables. 

1. Copy the provided `.env.example` file to a new file named `.env`.
2. Fill in the required values for the following keys:

```env
CORE_DB_URI= # Your MongoDB connection string
JWT_SECRET= # Secret key for JWT signing
GEMINI_API_KEY= # Your Google Gemini API Key
GOOGLE_MAPS_API_KEY= # Your Google Maps API Key
HUGGINGFACE_TOKEN= # Your HuggingFace Access Token
OPENWEATHER_API_KEY= # Your OpenWeather API Key
CLOUDINARY_NAME= # Your Cloudinary cloud name
CLOUDINARY_API_KEY= # Your Cloudinary API Key
CLOUDINARY_API_SECRET= # Your Cloudinary API Secret
LOCAL_AUTHENTICATION_KEY= # Key for local authentication strategies
```

## 📦 Installation

Install the project dependencies using npm:

```bash
npm install
```

## 🏃 Running the Application

The `package.json` includes standard NestJS scripts to run the server:

```bash
# Development mode
npm run start

# Watch mode (reloads on file changes)
npm run start:dev
```

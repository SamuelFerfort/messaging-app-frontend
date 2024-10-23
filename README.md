# Messaging App

<p align="center">
  <img src="https://res.cloudinary.com/dy0av590l/image/upload/v1729663614/Screenshot_from_2024-10-23_08-06-43_r9np75.png" alt="Messaging App screenshot" width="800"/>
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io Badge"/>
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary Badge"/>
  <img src="https://img.shields.io/badge/JWT-000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT Badge"/>
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL Badge"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma Badge"/>
</p>

A messaging app inspired by Telegram and WhatsApp, featuring real-time updates with Socket.io, secure authentication, media uploads, and customizable profiles.

## 🔗 Links

- **Live Demo:** [https://messaging-app-frontend-gamma.vercel.app/chats](https://messaging-app-frontend-gamma.vercel.app)
- **Backend Repository:** [https://github.com/SamuelFerfort/messaging-app-backend](https://github.com/SamuelFerfort/messaging-app-backend)

## 🚀 Technologies

- **Frontend:** React, Vite
- **Real-time Communication:** Socket.io
- **Data Management:** React Query
- **Authentication:** Custom JWT-based authentication
- **Media Uploads:** Cloudinary
- **Styling:** TailwindCSS
- **Database:** Prisma, PostgreSQL

## 🌟 Features

- **Real-time Messaging:** Instant messaging with real-time updates powered by Socket.io.
- **Notifications:** Get notified when a user sends you a message.
- **User Authentication:** Secure login and registration using JWT.
- **Media Uploads:** Upload and share images through Cloudinary.
- **Profile Customization:** Users can update their avatar and 'About' section to personalize their profiles.
- **Group Creation:** Create and manage groups for chatting with multiple users.

## 🔧 Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/SamuelFerfort/messaging-app-frontend.git
   cd messaging-app-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install

   ```

3. **Configure Environment Variables:** Create a .env file in the root directory and add the following variables:

   ```bash
   VITE_API_URL=your_api_url_here
   VITE_TOKEN=your_token_here

   ```


4. **Run the Development Server:**

   ```bash

   npm run dev

   ```

## 🎯 Goals

The goal of this project is to practice building an application with Socket.io using React and Vite, implementing a database schema with Prisma and PostgreSQL, and learning how to fetch data from an API with React Query.


## 📄 License

This project is licensed under the [MIT License](LICENSE).
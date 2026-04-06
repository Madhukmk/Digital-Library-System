# Digital Library System

A comprehensive, full-stack digital library management software that provides a robust interface for users to browse, search, and download books, alongside an advanced administrative portal to manage users, books, and analytics. 

## Features
- **User Authentication & Authorization**: Secure JSON Web Token (JWT) based login system distinguishing between standard `user` and `admin` roles.
- **Email OTP Verification**: Registration securely incorporates mandatory real-world email verification via a 6-digit OTP passcode before account creation (powered by Nodemailer).
- **Admin Dashboard**: Privileged dashboard allowing administrators to track analytics, manage the user base, and upload new book entries.
- **Native File Uploads**: Administrators can natively attach Cover Images (JPEG/PNG) and Book Soft Copies (PDF) to local storage securely utilizing `multer`. 
- **Dynamic User Dashboard**: Users can monitor their downloaded books, search the library database, and seamlessly interact with the vast array of available resources.
- **Responsive & Modern UI**: Built meticulously with React and Tailwind-inspired raw CSS styling, offering dark modes and a vibrant digital storefront feel.

## Tech Stack
- **Frontend**: React.js, Vite, React Router, Context API, Lucide-React (Icons)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ORM
- **Utilities**: Nodemailer (Email/OTP routing), Multer (File management), Bcrypt (Password hashing), JWT (Auth).

## Database Architecture (Collections)
The system leverages MongoDB to store document-oriented data across three primary collections:
1. **Users (`users`)**
   - Stores account information including `name`, `email`, hashed `password`, and the authorization `role` (standard user vs. admin).
2. **Books (`books`)**
   - Maintains the library catalog, housing data for each book's `title`, `author`, `category`, and `downloads` tracker. It also stores the string file-paths mapping to the `cover` image and `pdfUrl` soft copy.
3. **OTPs (`otps`)**
   - A secure, temporary schema utilized strictly during user creation. Holds the validation `email` and the 6-digit `otp`. Governed by a strict 5-minute TTL (Time-to-Live) index so expired tokens intuitively self-destruct to ensure system integrity.
4. **Carts (`carts`)**
   - Manages user-specific downloads and libraries. Uses Mongoose `ObjectId` references to build a relational bridge linking a single `User` to an array of specific `Book` documents they have interacted with or saved to their library.

## Setting Up on a New System
If you are downloading this project onto a brand new computer or cloning it from GitHub, follow these exact steps to get it running:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Madhukmk/Digital-Library-System.git
   cd Digital-Library-System
   ```

2. **Install Dependencies**
   Run the following terminal commands at the root folder to install all required Node modules for both the backend and frontend:
   ```bash
   npm install concurrently
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

2. **Environment Variables**
   The `backend/.env` securely houses your environment payload:
   ```env
   MONGO_URI=your_mongodb_cluster_uri
   PORT=5000
   JWT_SECRET=your_secret_hash_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_google_app_password
   ```

3. **Database Seeding (Optional/Initialization)**
   To completely clear any corrupted state and inject mock books/users directly into MongoDB:
   ```bash
   npm run data:destroy
   npm run data:import
   ```

4. **Launch Application**
   Boot both the Vite Frontend and Nodemon Backend servers simultaneously using `concurrently`:
   ```bash
   npm run start
   ```

## Default Mock Users (Login Credentials)
If you ran the active data seeder, you will instantly have robust accounts set up within your MongoDB cluster. You can freely use these credentials to log in without needing to test the OTP Registration flow:

| Role | Name | Email | Password |
|---|---|---|---|
| **Admin** | Jane Smith | `jane@example.com` | `12345` |
| **User** | John Doe | `john@example.com` | `12345` |
| **User** | Alice Johnson | `alice@example.com` | `12345` |

*(Note: Admin accounts exclusively have access to the `/admin` routing portal where file uploading occurs).*

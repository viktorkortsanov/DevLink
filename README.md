# 💼 DevLink

**DevLink** is a web platform built to help **junior developers** and **aspiring programmers** showcase their skills, establish a presence in the tech world, and find internship opportunities. It combines community features, personal profile pages, and resource sharing into one centralized hub focused on developer growth and career discovery.

---

## 🌟 Purpose

The main goal of DevLink is to **accelerate the career journey** of junior developers by:

- Enabling users to **build a profile** that reflects their skills, links, and projects
- Creating a **space for collaboration**, community engagement, and visibility
- Helping them **connect with mentors, recruiters, and other developers**

---

## 🧩 Features

### 🔐 Authentication
- User registration, login, and logout system
- Sends a welcome email to the user upon successful registration

### 👤 Developer Profiles
- Public profiles including:
  - Username, bio, and location
  - Tech stack and skill tags
  - Social links (GitHub, LinkedIn, etc.)
  - Portfolio and personal project links
  - Applied and saved projects
  - Edit profile functionality

### 👨‍💼 Employer Profiles
- Public profiles including:
  - Username, bio, and location
  - Tech stack and skill tags
  - Social links (GitHub, LinkedIn, etc.)
  - Portfolio and personal project links
  - Posted projects and saved developers
  - Edit profile functionality

### 🗂️ Projects Page
- Employers can:
  - Create and delete projects
  - View applicants for each project
- Developers can apply for projects
- Filter projects by type, experience level, and work type

### 🧷 Developers Page (employers only)
- Employers can:
  - Search developers by name, skills, or location
  - View developer profiles
  - Post reviews and feedback for developers

### 🧠 Mentors Page (developers only)
- Developers can apply to join the mentorship program

### 🛠 Admin Panel (admins only)
- **User Management** – Manage users, permissions, and account status  
- **Project Management** – Oversee projects and manage content  
- **Analytics** – Track platform metrics, user engagement, and performance  
- **Admin Chat** – Real-time communication between admins
- **❗Admin Credentials - email: devlinkadmin@gmail.com ; password: admin123456**

### 📄 Additional Pages
- **Home** – Introduction to the platform and its purpose
- **Contact Us** – Users can reach out to the support team via email
- **Privacy Policy** – Explains how user data is collected and handled
- **Terms of Service** – Outlines the platform's usage rules and legal terms

---
### Follow these steps to get the DevLink application up and running on your local machine for development and testing purposes.
---

### **Client Application Setup**

1. **Clone the Repository**:  
   You can clone the repository using the following command or download it as a ZIP file and extract it on your computer.

   ```bash
   git clone https://github.com/viktorkortsanov/DevLink.git
   ```

2. **Navigate to the Project Directory**:  
   Use the terminal to navigate to the project directory.

   ```bash
   cd devlink
   ```

3. **Navigate to the Client Directory**:  
   Go to the client directory.

   ```bash
   cd client
   ```

4. **Install Dependencies**:  
   Install all the necessary dependencies by running the following command in your terminal:

   ```bash
   npm install
   ```

5. **Run the Client Part**:  
   Start the Angular development server with this command:

   ```bash
   ng serve
   ```

6. **Open the Project**:  
   Access the application by opening the following URL in a web browser:  
   `http://localhost:4200/`

---

### **Server Part Setup**

**Before setup the server part download MongoDB and Node.JS**

Download MongoDB from here **[MongoDB Community Edition](https://www.mongodb.com/try/download/community)**.
Download Node.JS from here **[Node.JS](https://nodejs.org/en/download)**.

1. **Create new terminal**:  

2. **Navigate to the Project Directory**:  
   Go to the project directory:

   ```bash
   cd devlink
   ```

3. **Navigate to the Server Directory**:  
   Go to the server directory:

   ```bash
   cd server
   ```   

4. **Install Server Dependencies and Start the Server**:  
   Execute the following commands in order to start the server.

   ```bash
   npm install
   npm start
   ```

5. **Running the Server**:  
   Once the server is started, it will listen for requests on:  
   `http://localhost:3030/`

   ❗ If you have problems connecting to the data base change the url in index.js ❗
---

### **Client Tests Setup**

1. **Navigate to the Client Directory**:  
   Go to the client directory.

   ```bash
   cd client
   ```

2. **Run tests using the following command**:

   ```bash
   ng test
   ```
   
---

🛠️ **Technologies and Tools**  

<p align="left">
  <img src="https://github.com/devicons/devicon/blob/master/icons/angular/angular-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/typescript/typescript-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/express/express-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/ngrx/ngrx-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/chartjs/chartjs-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/firebase/firebase-plain.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/karma/karma-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/jasmine/jasmine-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original.svg" width="40" height="40"/>
  <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-original.svg" width="40" height="40"/>
</p>

---

### 📚 Libraries

- **@angular/animations** – Enables smooth and dynamic UI transitions in the Angular frontend  
- **socket.io** – Provides real-time, bidirectional communication between client and server via WebSockets  
- **cookie-parser** – Parses cookies attached to the client request object in Express.js  
- **bcrypt** – Securely hashes passwords before storing them in the database  
- **emailjs-com** – Sends transactional emails directly from the client side using EmailJS  
- **mongoose** – An elegant MongoDB object modeling tool for Node.js  
- **jsonwebtoken** – Creates and verifies JSON Web Tokens (JWT) for secure authentication  
- **cors** – Enables Cross-Origin Resource Sharing to allow safe API calls between different origins  
- **firebase** – Used for hosting the frontend, handling authentication, and providing real-time database capabilities  
- **chart.js** – A flexible and lightweight charting library for building visual data dashboards
- **swiper** – A modern mobile-friendly slider used for carousels, profile previews, and other swipe-based UI elements
- **karma** – A test runner that launches browsers, executes tests, and reports results, enabling automated testing in the Angular environment
- **jasmine** – A behavior-driven development framework for testing JavaScript code, providing a clear syntax for writing unit and integration tests

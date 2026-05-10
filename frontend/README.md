# 🛰️ AVCP Neural Assembly (Titan Engine)

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![Socket.io](https://img.shields.io/badge/Socket.io-WebRTC-black?style=for-the-badge&logo=socket.io)

**AVCP - Titan Engine** is a next-generation, highly secure, and role-based educational management framework. Designed with a sci-fi inspired "Neural Core" interface, it seamlessly bridges the communication and operational gap between Teachers, Students, and Parents.

---

## 🚀 Core Features

### 🛡️ Multi-Tier Security (RBAC)
- **Role-Based Access Control:** Distinct, isolated dashboards and operational privileges for `Teacher`, `Student`, and `Parent` nodes.
- **Trinity MFA:** Multi-factor authentication using OTP via email (Nodemailer integration).
- **Neural Key Recovery:** Secure, JWT-based password reset and profile configuration protocols.

### 📡 Live Communications
- **WebRTC Video Nodes:** Real-time, secure video streaming capabilities for remote learning and virtual classrooms.
- **WebSocket Sync:** Powered by Socket.io for instantaneous data flow.

### 🧩 Dynamic Dashboard Engine
- **Teacher Console:** Manage attendance, grade assignments, and monitor overall analytics.
- **Student Hub:** Track active streams, submit tasks, and access personal assignments.
- **Parent Overseer:** Keep track of linked student nodes, monitor attendance, and view grades.

### 👁️ Accessibility & UI
- **Sci-Fi Glassmorphism:** Highly responsive UI with atmospheric glows, telemetry indicators, and sleek modals.
- **Accessibility Context:** Built-in High-Contrast mode and Dynamic Font Scaling (Neural Scaling) for optimal readability.

---

## 🛠️ Technical Stack

- **Frontend Core:** React.js, Vite, Tailwind CSS, Lucide React (Icons)
- **Backend Core:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs, Nodemailer
- **State Management:** React Context API

---

## ⚙️ Initialization Protocol (Local Setup)

To run the Titan Engine locally on your machine, follow these steps:

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/yourusername/avcp-titan-engine.git
\`\`\`

**2. Setup Backend Server:**
\`\`\`bash
cd backend
npm install
# Create a .env file and add your MongoDB URI, JWT Secrets, and Email Config
npm run dev
\`\`\`

**3. Setup Frontend Client:**
\`\`\`bash
cd frontend
npm install
# Create a .env file and add your VITE_GOOGLE_CLIENT_ID
npm run dev
\`\`\`

---

*Developed by Operator Krishna Prajapat.*

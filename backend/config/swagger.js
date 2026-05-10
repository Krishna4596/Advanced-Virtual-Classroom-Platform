// backend/config/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");

/**
 * 📚 TITAN API BLUEPRINT (v4.2)
 * Ref: Report Section 5.2 (API Specifications & Documentation)
 * Purpose: Automated documentation for academic and security nodes.
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Titan Virtual Classroom API",
      version: "4.2.0",
      description: "Comprehensive API documentation for Student, Teacher, and Parent modules.",
      contact: {
        name: "Titan Engine Support",
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" 
          ? process.env.BASE_URL 
          : `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.NODE_ENV === "production" ? "Production Server" : "Local Development Node",
      },
    ],
    components: {
      securitySchemes: {
        // 🔐 JWT Authentication
        bearerAuth: { 
          type: "http", 
          scheme: "bearer", 
          bearerFormat: "JWT",
          description: "Enter your JWT token to access protected academic nodes."
        },
        // 🛡️ CSRF Protection (Optional for Swagger testing)
        csrfToken: {
          type: "apiKey",
          in: "header",
          name: "X-CSRF-Token",
        }
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // 🛰️ DISCOVERY: Scanning routes and models for documentation patterns
  apis: ["./routes/*.js", "./models/*.js"], 
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
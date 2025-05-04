# SkillSwap Backend

This is the backend for the SkillSwap application, built with Node.js, Express, GraphQL, and TypeScript. It provides APIs for user authentication, data management, and real-time GraphQL subscriptions.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v20 or higher)
- **yarn** (latest version recommended)
- **MongoDB** (accessible remotely)

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/SkillSwap-Backend.git
   cd SkillSwap-Backend

2. **Install Dependencies**

   ```bash
   yarn install

3. **Set Up Environment Variables**

Create a .env file and add te variables from the .env.default there 

4. **Generate GraphQL Types (optional)**
   
    ```bash
    yarn generate

5. **Start the Development Server**

    ```bash
    yarn dev
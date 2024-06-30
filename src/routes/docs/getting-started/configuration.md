---
title: "Configuring SveltyCMS"
description: "Instructions on setting up environment variables and other configurations necessary for running SveltyCMS."
---

# Configuration

Configure SveltyCMS by setting up the environment variables and other necessary settings.

## Environment Variables

Create a `.env` file in the root directory of your project. Below is a list of essential environment variables:

```plaintext
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/sveltycms
JWT_SECRET=your_jwt_secret

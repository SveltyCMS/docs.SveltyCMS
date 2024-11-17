---
title: "Installation Guide"
description: "Step-by-step guide to install SvelteCMS for end users"
icon: "mdi:download"
published: true
order: 1
---

# Installing SvelteCMS

This guide will walk you through the process of installing SvelteCMS on your system.

## Prerequisites

Before installing SvelteCMS, ensure you have the following:

- [Node.js](https://nodejs.org/en) (LTS version recommended)
- MongoDB installed and running
- Git (for downloading the source code)

## Installation Steps

1. **Download SvelteCMS**
   ```bash
   git clone https://github.com/SveltyCMS/SveltyCMS.git
   cd SvelteCMS
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Installation Wizard**
   ```bash
   npm run installer
   ```
   Follow the prompts to configure your CMS:
   - Database connection
   - Admin account setup
   - Site preferences
   - Language settings

4. **Start the CMS**
   ```bash
   npm run dev
   ```

## Verifying Installation

After installation:

1. Open your browser and navigate to `http://localhost:5173`
2. Log in with your admin credentials
3. You should see the SvelteCMS dashboard

## Next Steps

After successful installation:

1. [Configure your site settings](./02_Configuration.md)
2. [Create your first content collection](../02_Content/01_Collections.md)
3. [Set up user roles and permissions](../03_Users/01_User_Management.md)

## Common Issues

If you encounter any issues during installation:

1. **Database Connection Failed**
   - Verify MongoDB is running
   - Check connection string in configuration
   - Ensure network connectivity

2. **Port Already in Use**
   - Change the port in configuration
   - Check for other running services

3. **Dependencies Installation Failed**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

For more detailed troubleshooting, see our [Troubleshooting Guide](./03_Troubleshooting.md).

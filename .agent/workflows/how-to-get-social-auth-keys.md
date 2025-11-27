---
description: How to get Google and GitHub OAuth API Keys
---

# How to Get Social Authentication Keys

## 1. GitHub OAuth Keys
1.  Go to **[GitHub Developer Settings](https://github.com/settings/developers)**.
2.  Click **"New OAuth App"**.
3.  Fill in the form:
    *   **Application Name**: `VibeStack` (or your app name)
    *   **Homepage URL**: `https://your-domain.com` (or `http://localhost:3000` for local testing)
    *   **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github` (or `http://localhost:3000/api/auth/callback/github`)
4.  Click **"Register application"**.
5.  Copy the **Client ID**.
6.  Click **"Generate a new client secret"** and copy the **Client Secret**.
7.  Add these to your `.env` file:
    ```env
    GITHUB_ID=your_client_id
    GITHUB_SECRET=your_client_secret
    ```

## 2. Google OAuth Keys
1.  Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2.  Create a new project (e.g., "VibeStack").
3.  Go to **"APIs & Services" > "OAuth consent screen"**.
    *   Select **External** and click **Create**.
    *   Fill in the App Name and User Support Email.
    *   Click **Save and Continue**.
4.  Go to **"Credentials"**.
5.  Click **"Create Credentials" > "OAuth client ID"**.
6.  Select **"Web application"**.
7.  Add **Authorized JavaScript origins**:
    *   `https://your-domain.com`
    *   `http://localhost:3000`
8.  Add **Authorized redirect URIs**:
    *   `https://your-domain.com/api/auth/callback/google`
    *   `http://localhost:3000/api/auth/callback/google`
9.  Click **Create**.
10. Copy the **Client ID** and **Client Secret**.
11. Add these to your `.env` file:
    ```env
    GOOGLE_CLIENT_ID=your_client_id
    GOOGLE_CLIENT_SECRET=your_client_secret
    ```

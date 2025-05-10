# Knowledge Chakra Backend API

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Set up a database user with password authentication
4. Get your connection string from the "Connect" button
5. Update your `.env` file with the connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/knowledge_chakra
   ```

### Option 2: Local MongoDB Installation (for Development)

#### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the prompts
3. Add MongoDB bin directory to your PATH
4. Create a data directory: `mkdir -p C:\data\db`
5. Start MongoDB server: `mongod --dbpath=C:\data\db`
6. Update your `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/knowledge_chakra
   ```

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 3: Docker (Recommended for Development)
```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`

3. Start the development server:
```bash
npm run dev
```

## First Login

When you first start the server, an admin account will be automatically created with credentials from your `.env` file. The default is:
- Email: admin@knowledgechakra.com
- Password: AdminPass@2023!

**Important:** Change these credentials after your first login! 
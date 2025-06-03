# Ethics Game Project

An interactive web application that presents users with historical ethical dilemmas powered by AI. The game challenges players to make moral decisions in different historical contexts, helping them understand the complexity of ethical decision-making across different time periods.

## Features

- 🎮 Interactive ethical dilemmas from various historical periods
- 🤖 AI-powered scenario generation using Google's Gemini AI
- 👤 User authentication and session management
- 📊 Score tracking and decision history
- 🎨 Modern, responsive UI built with React and Tailwind CSS
- 🔒 Secure backend built with FastAPI and PostgreSQL

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Axios for API communication

### Backend
- FastAPI (Python)
- PostgreSQL database
- SQLAlchemy ORM
- JWT authentication
- Google Gemini AI integration

## Setup Instructions

### Prerequisites
- Python 3.x
- PostgreSQL
- Node.js and npm

### Environment Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
npm install
```

4. Environment Variables:
- Copy `.env.example` to create your own `.env` file:
```bash
cp .env.example .env
```
- Open `.env` and update the values with your actual credentials:
  - DB_HOST: Your database host
  - DB_NAME: Your database name
  - DB_USER: Your database username
  - DB_PASSWORD: Your database password
  - JWT_SECRET_KEY: Your JWT secret key
  - GEMINI_API_KEY: Your Google Gemini AI API key

### Database Setup
1. Make sure PostgreSQL is running
2. Create a database named 'ethics_game' (or your preferred name)
3. Update the `.env` file with your database credentials

### Running the Application

1. Start the backend server:
```bash
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Security Notes
- Never commit the `.env` file
- Keep your credentials secure
- Regularly update your dependencies

## License
[Add your chosen license here] 
# Ethics Game Project

## Setup Instructions

### Prerequisites
- Python 3.x
- PostgreSQL
- Node.js (if using a frontend)

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

### Database Setup
1. Make sure PostgreSQL is running
2. Create a database named 'ethics_game' (or your preferred name)
3. Update the `.env` file with your database credentials

### Running the Application
[Add specific instructions for running your application]

## Contributing
1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Security Notes
- Never commit the `.env` file
- Keep your credentials secure
- Regularly update your dependencies 
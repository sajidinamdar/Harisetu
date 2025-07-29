# Python Environment Setup

This document provides instructions for setting up the Python environment for this project.

## Prerequisites

- Python 3.9+ installed
- Visual Studio Code with Python and Pylance extensions

## Setup Instructions

1. **Activate the Virtual Environment**

   On Windows:
   ```
   .\venv\Scripts\activate
   ```

   On macOS/Linux:
   ```
   source venv/bin/activate
   ```

2. **Install Dependencies**

   ```
   pip install -r backend/requirements.txt
   ```

3. **Configure VS Code**

   The project includes VS Code settings in the `.vscode` directory that should automatically:
   - Use the correct Python interpreter from the virtual environment
   - Set up proper import paths
   - Enable code completion and type checking

4. **Troubleshooting Import Issues**

   If you encounter import errors in VS Code:
   
   1. Make sure you've opened VS Code with the project root as the workspace
   2. Reload the VS Code window (Ctrl+Shift+P, then "Reload Window")
   3. Select the correct Python interpreter (Ctrl+Shift+P, then "Python: Select Interpreter")
   4. Restart the Python language server (Ctrl+Shift+P, then "Python: Restart Language Server")

5. **Running the Application**

   To run the FastAPI backend:
   ```
   cd backend
   uvicorn app.main:app --reload
   ```

   Or use the "Python: FastAPI" launch configuration in VS Code's Run and Debug panel.

## Common Issues and Solutions

### Import "passlib.context" could not be resolved

If VS Code shows an error for imports but the code runs correctly:

1. Make sure you're using the virtual environment's Python interpreter
2. Try running the `test_imports.py` script to verify all imports work
3. Restart the Python language server in VS Code

### SQLAlchemy or Database Issues

1. Check that the database URL in your `.env` file is correct
2. Verify that all required database drivers are installed
3. For SQLite, ensure the database file path is accessible

### Package Installation Issues

If you encounter issues installing packages:

1. Update pip: `python -m pip install --upgrade pip`
2. Try installing packages individually
3. Check for platform-specific requirements (e.g., for psycopg2-binary)
# Face Attendance Node+Python Backend

## Setup Instructions

1. **Python Environment:**
   - Create a virtual environment (recommended):
     ```sh
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```sh
     pip install -r requirements.txt
     ```
   - Place your reference image as `reference.jpg` in this folder.

2. **Node.js Environment:**
   - Install dependencies:
     ```sh
     npm install express multer
     ```
   - Start the server:
     ```sh
     node index.js
     ```

3. **How it works:**
   - The frontend sends a face image to `/api/attendance`.
   - Node.js receives the image and pipes it to `face_match.py`.
   - Python script compares the image to `reference.jpg` and returns `present` or `not present`.

---

**Note:**
- Ensure Python is available in your system PATH as `python`.
- For production, consider error handling, security, and performance improvements.

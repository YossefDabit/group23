from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
import bcrypt
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
DB_NAME = os.getenv('MONGO_DB_NAME')

# Setup Mongo connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
users_collection = db['users']
appointments_collection = db['appointments']

# --------------------------------------------------
# Landing Page (Home)
# --------------------------------------------------
@app.route('/')
def home():
    return render_template('index.html')

# --------------------------------------------------
# Page Routes - Serve HTML Pages
# --------------------------------------------------
@app.route('/register-page')
def register_page():
    return render_template('register.html')

@app.route('/login-page')
def login_page():
    return render_template('login.html')

@app.route('/personal-area')
def personal_area():
    return render_template('personal-area.html')

@app.route('/about')
def about_page():
    return render_template('about.html')

# --------------------------------------------------
# Authentication Routes
# --------------------------------------------------

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    full_name = data.get('fullName')
    email = data.get('email')
    phone = data.get('phone')
    birthdate = data.get('birthdate')
    password = data.get('password')

    if not email or not password or len(password) < 6:
        return jsonify({"success": False, "message": "Invalid email or password"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"success": False, "message": "Email already registered"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user = {
        "fullName": full_name,
        "email": email,
        "phone": phone,
        "birthdate": birthdate,
        "password": hashed_password.decode('utf-8')
    }

    users_collection.insert_one(user)

    return jsonify({"success": True, "message": "User registered successfully!"})


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({"success": True, "message": "Login successful!"})
    else:
        return jsonify({"success": False, "message": "Invalid password"}), 401


@app.route('/get-user-data', methods=['POST'])
def get_user_data():
    data = request.json
    email = data.get('email')

    user = users_collection.find_one({"email": email}, {"_id": 0})

    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({"success": True, "user": user})


# --------------------------------------------------
# Appointment Routes
# --------------------------------------------------

@app.route('/book-appointment', methods=['POST'])
def book_appointment():
    data = request.json

    service_prices = {
        "Haircut": 30,
        "Facial": 40,
        "Haircut + Facial": 60
    }

    service_type = data.get('typeOfService')
    if service_type not in service_prices:
        return jsonify({"success": False, "message": "Invalid service type"}), 400

    price = service_prices[service_type]

    appointment = {
        "email": data['email'],
        "barber": data['barber'],
        "typeOfService": service_type,
        "price": price,
        "date": data['date'],
        "time": data['time']
    }

    appointments_collection.insert_one(appointment)

    return jsonify({"success": True, "message": f"Appointment booked successfully! Total cost: ${price}"})


@app.route('/get-appointments', methods=['POST'])
def get_appointments():
    data = request.json
    email = data.get('email')

    appointments = list(appointments_collection.find(
        {"email": email},
        {"_id": 0}  # Exclude `_id` for JSON compatibility
    ))

    return jsonify({"success": True, "appointments": appointments})


@app.route('/cancel-appointment', methods=['POST'])
def cancel_appointment():
    data = request.json

    result = appointments_collection.delete_one({
        "email": data['email'],
        "date": data['date'],
        "time": data['time']
    })

    if result.deleted_count > 0:
        return jsonify({"success": True, "message": "Appointment cancelled successfully!"})
    else:
        return jsonify({"success": False, "message": "Appointment not found."}), 404


# --------------------------------------------------
# Run Flask Application
# --------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True)

import sys
import face_recognition
import numpy as np
from datetime import datetime
import requests
import os
import json

def download_image(url, filename):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"Error downloading image from {url}: {e}")
        return False

# Step 1: Prepare lists for reference images, encodings, and user IDs
reference_image_paths = []
reference_encodings = []
user_ids = []

# Step 2: Parse avatar URLs and user IDs from arguments
if len(sys.argv) > 2:
    try:
        user_data = json.loads(sys.argv[2])
        avatar_urls = [user.get('avatar') for user in user_data]
        user_ids = [user.get('_id') for user in user_data]
    except json.JSONDecodeError:
        print("Error: Invalid JSON format for user data")
        sys.exit(1)
else:
    avatar_urls = []

# Step 3: Create a temporary directory for reference images
ref_dir = 'temp_reference_images'
if not os.path.exists(ref_dir):
    os.makedirs(ref_dir)

# Step 4: Download and save each reference image (user avatar)
for i, (url, user_id) in enumerate(zip(avatar_urls, user_ids)):
    if not url:  # Skip empty URLs
        continue
    filename = os.path.join(ref_dir, f'user_{user_id}.jpg')
    if download_image(url, filename):
        reference_image_paths.append(filename)

# Step 5: For each reference image, load it and encode the face
for reference_image_path in reference_image_paths:
    # print(f"Loading reference image: {reference_image_path}", flush=True)
    try:
        # Load the image file
        reference_image = face_recognition.load_image_file(reference_image_path)
        # Encode the face(s) in the reference image
        reference_face_encodings = face_recognition.face_encodings(reference_image)
        if len(reference_face_encodings) == 0:
            print(f"No face detected in the reference image: {reference_image_path}", flush=True)
            continue
        # Store the first face encoding for this user
        reference_encodings.append(reference_face_encodings[0])
    except Exception as e:
        print(f"Error processing reference image: {e}")
        continue

# Step 6: Exit if no valid reference encodings found
if len(reference_encodings) == 0:
    print("No valid reference images found.", flush=True)
    sys.exit(1)

# Step 7: Check if at least one uploaded image path is provided
if len(sys.argv) < 2:
    print("Usage: python script.py <uploaded_image_path1> <uploaded_image_path2> ...")
    sys.exit(1)

# Step 8: Load and process the uploaded image (first argument)
uploaded_image_path = sys.argv[1]
# print(f"Loading uploaded image: {uploaded_image_path}", flush=True)
try:
    # Load the uploaded image file
    uploaded_image = face_recognition.load_image_file(uploaded_image_path)
    # Encode the face(s) in the uploaded image
    uploaded_face_encodings = face_recognition.face_encodings(uploaded_image)
    
    if len(uploaded_face_encodings) == 0:
        print(f"No face detected in the uploaded image: {uploaded_image_path}")
        sys.exit(1)
    
    # Step 9: Compare each detected face in the uploaded image against reference encodings
    def euclidean_distance(a, b):
        # Compute Euclidean distance between two 1D arrays (vectors)
        # For each pair of elements (x, y) in a and b, compute (x - y) ** 2
        # Sum all squared differences
        # Take the square root of the sum to get the Euclidean distance
        return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

    threshold = 0.6  # You may adjust this threshold based on your use case

    for i, uploaded_encoding in enumerate(uploaded_face_encodings):
        try:
            # Compute Euclidean distances to each reference encoding
            distances = [euclidean_distance(uploaded_encoding, ref_enc) for ref_enc in reference_encodings]
            # Find the minimum distance and its index
            min_distance = min(distances)
            min_index = distances.index(min_distance)

            # print(f"Face distances for face {i+1} in {uploaded_image_path}: {distances}")

            if min_distance < threshold:
                # Match found
                filename = os.path.basename(reference_image_paths[min_index])
                user_id = filename.split('_')[1].split('.')[0]  # Extract user ID from filename
                # print(f"Match found for user: {user_id}")
                print(user_id)
                sys.exit(0)
            else:
                print(f"Face {i+1} is not a match (min distance: {min_distance:.4f})")
        except Exception as e:
            print(f"Error processing uploaded image: {e}")
            sys.exit(1)
except Exception as e:
    print(f"Error loading uploaded image: {e}")
    sys.exit(1)
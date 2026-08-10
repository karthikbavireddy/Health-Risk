#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Building React Frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Installing Backend Python Dependencies..."
pip install -r backend/requirements.txt

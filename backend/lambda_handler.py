"""
AWS Lambda handler for Autonomous OS Flask app
Uses Mangum to adapt Flask (WSGI) to Lambda (ASGI/event) interface
"""
from mangum import Mangum
from app import app

# Mangum wraps the Flask WSGI app as a Lambda handler
handler = Mangum(app, lifespan="off")

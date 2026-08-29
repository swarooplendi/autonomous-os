import os
import sys

# Add vendor directory to sys.path
vendor_dir = os.path.join(os.path.dirname(__file__), "vendor")
if os.path.exists(vendor_dir):
    sys.path.insert(0, vendor_dir)

from mangum import Mangum
from asgiref.wsgi import WsgiToAsgi
from app import app

# Adapt Flask WSGI to ASGI, then wrap with Mangum for Lambda
asgi_app = WsgiToAsgi(app)
handler = Mangum(asgi_app, lifespan="off")

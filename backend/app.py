"""
Autonomous OS - Flask Backend
Swaroop Lendi's Personal AI Operating System API
"""

import os
import json
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, abort
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# Detect Lambda environment — disable SocketIO (not needed in serverless)
IS_LAMBDA = bool(os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "autonomous-os-dev-secret")

CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:4173", os.environ.get("FRONTEND_URL", "*")]}})

if not IS_LAMBDA:
    from flask_socketio import SocketIO, emit
    socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
else:
    socketio = None

# ─────────────────────────────────────────────
# Owner Profile Data
# ─────────────────────────────────────────────
OWNER_PROFILE = {
    "identity": {
        "fullName": "Swaroop Lendi",
        "shortName": "Swaroop",
        "osName": "Autonomous OS",
        "version": "v4.2.0-prod",
        "location": "Bangalore, India",
        "timezone": "IST (UTC+5:30)",
        "email": "lendiswaroop@gmail.com",
        "phone": "+91-9738141464",
        "linkedin": "https://linkedin.com/in/swarooplendi",
        "github": "https://github.com/swarooplendi",
        "whatsapp": "https://wa.me/919738141464?text=Hi%20Swaroop%2C%20reaching%20out%20regarding%20Platform%20Engineering",
        "profession": "Distributed Systems & Platform Engineer",
        "positioning": "Architecting 65+ PB ADAS data lakes, zero-trust connected vehicle fleets, and AI-assisted MCP infrastructure at global scale.",
        "roles": [
            "Distributed Systems Architect",
            "DevSecOps & Platform Engineer",
            "ADAS Telemetry Specialist",
            "AI / MCP Infrastructure Builder",
            "SRE Lead"
        ],
        "headline": "Building Resilient Platforms at Massive Data Scale",
        "intro": "5+ years engineering large-scale cloud infrastructure, high-throughput streaming pipelines, and AI-assisted developer platforms across autonomous driving and 1M+ connected vehicle fleets.",
        "currentOrg": "Qualcomm",
        "previousOrg": "Excelfore",
    },
    "metrics": [
        {"value": "65+ PB", "label": "Data Lake Managed", "status": "verified", "detail": "S3-based ADAS perception & AI training data lake"},
        {"value": "1 PB/day", "label": "Telemetry Throughput", "status": "verified", "detail": "High-throughput vehicle telemetry ingestion"},
        {"value": "1M+", "label": "Connected Vehicles", "status": "verified", "detail": "Zero-trust mTLS fleet at Excelfore"},
        {"value": "40%", "label": "IaC Velocity Boost", "status": "verified", "detail": "Via MCP agentic automation"},
        {"value": "35%", "label": "LLM Token Savings", "status": "verified", "detail": "Context pruning engine"},
        {"value": "22%", "label": "FinOps Savings", "status": "verified", "detail": "S3 lifecycle tiering optimization"},
        {"value": "99.95%", "label": "Production Uptime", "status": "verified", "detail": "Kubernetes HA microservices"},
        {"value": "30%", "label": "MTTR Reduction", "status": "verified", "detail": "Prometheus + Kibana proactive anomaly detection"},
    ]
}

PROJECTS = [
    {
        "id": "qualcomm-adas-telemetry",
        "title": "65+ PB ADAS Telemetry Data Lake",
        "org": "Qualcomm",
        "role": "DevSecOps & Platform Engineer",
        "dates": "Jun 2025 – Present",
        "category": "Autonomous Driving",
        "tagline": "1 PB/day ingestion pipeline and multi-petabyte S3 data lake for ADAS AI training.",
        "featured": True,
        "badges": ["65+ PB", "1 PB/day", "AWS Lambda + SQS", "Sub-1h SLA"],
        "challenge": "Global autonomous test vehicles generating up to 1 PB of sensor telemetry daily needed ingestion under strict SLAs without overwhelming cloud budgets.",
        "outcome": "Built event-driven Step Functions + Lambda + SQS pipelines processing 100k–200k files/day. 22% FinOps S3 cost reduction. 4x PostgreSQL transaction throughput improvement.",
        "stack": ["AWS S3", "AWS Lambda", "Step Functions", "SQS", "PostgreSQL", "CloudFormation", "Python", "Prometheus"],
        "metrics": [
            {"label": "Daily Ingest", "value": "1 PB/day"},
            {"label": "Total Lake", "value": "65+ PB"},
            {"label": "Fleet", "value": "~1,000 Vehicles"},
            {"label": "FinOps", "value": "22% Cost Reduction"},
        ],
        "status": "Production Active",
        "color": "#00d4ff"
    },
    {
        "id": "qualcomm-mcp-ai-infra",
        "title": "AI-Assisted Infrastructure & MCP Platform",
        "org": "Qualcomm",
        "role": "DevSecOps & Platform Engineer",
        "dates": "2025 – Present",
        "category": "AI Developer Platforms",
        "tagline": "Custom MCP servers and token context pruning engine accelerating IaC generation by 40%.",
        "featured": True,
        "badges": ["Model Context Protocol", "Agentic Workflows", "40% Faster IaC", "35% Token Savings"],
        "challenge": "Complex cloud infrastructure provisioning required repetitive boilerplate and costly LLM token usage when exposing raw logs to developer agents.",
        "outcome": "Built secure internal MCP servers exposing live platform schemas to AI agents. Reduced IaC cycle time by 40%, LLM token costs by 35%, and MTTR by 30%.",
        "stack": ["Model Context Protocol (MCP)", "Python", "LLM Tooling", "CloudFormation", "Docker"],
        "metrics": [
            {"label": "IaC Velocity", "value": "40% Faster"},
            {"label": "Token Savings", "value": "35% Reduction"},
            {"label": "MTTR", "value": "30% Improvement"},
        ],
        "status": "Production Active",
        "color": "#7c3aed"
    },
    {
        "id": "excelfore-zero-trust-vehicles",
        "title": "Zero-Trust Connected Vehicle Platform (1M+ Fleet)",
        "org": "Excelfore",
        "role": "DevOps & SRE Engineer",
        "dates": "Sept 2021 – Jun 2025",
        "category": "Edge IoT / Connected Vehicles",
        "tagline": "Zero-trust mTLS telemetry ingestion and Kinesis streaming for 1M+ production vehicles.",
        "featured": True,
        "badges": ["1M+ Vehicles", "mTLS + PKI", "AWS IoT FleetWise", "99.95% Uptime"],
        "challenge": "Connecting 1M+ consumer and commercial vehicles required impenetrable edge security, low-latency CAN-bus streaming, and rock-solid platform reliability.",
        "outcome": "Architected mTLS/PKI zero-trust device identity with AWS IoT Core FleetWise and Kinesis pipelines. Maintained 99.95% uptime on production Kubernetes clusters.",
        "stack": ["Kubernetes", "AWS IoT Core", "Kinesis", "MQTT", "mTLS/PKI", "Docker", "Helm", "Prometheus"],
        "metrics": [
            {"label": "Fleet Scale", "value": "1M+ Vehicles"},
            {"label": "Availability", "value": "99.95%"},
            {"label": "Security", "value": "mTLS + Hardware PKI"},
        ],
        "status": "Production Verified",
        "color": "#059669"
    },
    {
        "id": "excelfore-ota-cdn",
        "title": "Resilient Global OTA Firmware CDN",
        "org": "Excelfore",
        "role": "DevOps & SRE Engineer",
        "dates": "2022 – 2025",
        "category": "OTA Updates / Global CDN",
        "tagline": "Fault-tolerant global OTA firmware distribution with binary delta compression.",
        "featured": True,
        "badges": ["Global CDN", "Automotive OTA", "70% Bandwidth Savings", "99.98% Delivery"],
        "challenge": "Delivering multi-gigabyte firmware binaries to vehicles on intermittent cellular networks globally without device failures.",
        "outcome": "Built multi-region edge CDN with delta binary compression reducing bandwidth by up to 70% and cryptographic signature validation for rollback safety.",
        "stack": ["AWS CloudFront", "S3", "Kubernetes", "Binary Delta", "Python", "Go"],
        "metrics": [
            {"label": "Delivery Success", "value": "99.98%"},
            {"label": "Bandwidth Savings", "value": "Up to 70%"},
            {"label": "Coverage", "value": "Global Fleet"},
        ],
        "status": "Production Verified",
        "color": "#f59e0b"
    },
]

JOURNEY = [
    {"year": "2017–2021", "title": "CS Engineering @ VTU Bangalore", "story": "Built foundational systems thinking through computer science fundamentals at Visvesvaraya Technological University.", "skill": "Algorithms, Data Structures, OS Internals"},
    {"year": "Sept 2021", "title": "Joined Excelfore — DevOps & SRE", "story": "First engineering role on a production system connecting real vehicles to the cloud. Learned the weight of uptime.", "skill": "Docker, Kubernetes, MQTT, Production SRE"},
    {"year": "2022", "title": "Scaled to 1M+ Connected Vehicles", "story": "Led zero-trust edge security architecture with mTLS and PKI across the largest connected vehicle fleet in production.", "skill": "mTLS, PKI, AWS IoT FleetWise, Kinesis"},
    {"year": "2023", "title": "Built Global OTA Firmware CDN", "story": "Designed fault-tolerant Over-The-Air firmware delivery with delta compression, cryptographic validation, and rollback protection.", "skill": "CDN Architecture, Delta Compression, Binary Integrity"},
    {"year": "2024", "title": "First Encounter with LLM Agentic Infrastructure", "story": "Started exploring how LLMs could assist platform operations — context assembly, prompt engineering for infra tooling.", "skill": "LLM Tooling, Context Engineering, MCP Exploration"},
    {"year": "Jun 2025", "title": "Joined Qualcomm — ADAS & AI Platform", "story": "Moved to one of the most demanding data environments in the world: autonomous driving perception data at petabyte scale.", "skill": "Petabyte Data Lakes, Step Functions, FinOps"},
    {"year": "2025–Now", "title": "Building Agentic Infrastructure with MCP", "story": "Engineered custom Model Context Protocol servers exposing live platform telemetry and schemas to AI coding agents — 40% faster IaC cycles.", "skill": "Model Context Protocol, Agentic Automation, Token Optimization"},
]

ARTICLES = [
    {"id": "scaling-adas-ingestion", "title": "Scaling ADAS Telemetry Ingestion to 1 PB/day on AWS", "summary": "How we tuned backpressure, SQS concurrency, and Lambda lifecycle to reliably move 1 petabyte of autonomous vehicle sensor data daily.", "date": "2026-07-01", "readTime": "12 min", "tags": ["ADAS", "AWS Lambda", "SQS", "Distributed Systems"]},
    {"id": "mcp-for-platform-engineering", "title": "Building Secure MCP Servers for Platform Engineers", "summary": "A practical guide to exposing cloud infrastructure schemas, telemetry feeds, and blast-radius simulators to LLM coding agents via Model Context Protocol.", "date": "2026-06-15", "readTime": "9 min", "tags": ["MCP", "LLM Agents", "Platform Engineering", "Security"]},
    {"id": "zero-trust-connected-vehicles", "title": "Zero-Trust Edge Telemetry at 1 Million Vehicles", "summary": "mTLS, hardware PKI device identity, and AWS IoT Core FleetWise for securing real-time CAN-bus diagnostic streams from a global commercial vehicle fleet.", "date": "2026-05-20", "readTime": "11 min", "tags": ["Zero Trust", "mTLS", "IoT", "Automotive"]},
    {"id": "finops-s3-data-lake", "title": "Cutting S3 Costs by 22% on a 65 PB Data Lake", "summary": "Automated lifecycle tiering strategies for large-scale ADAS perception storage without violating 12-hour ML training retrieval SLAs.", "date": "2026-04-10", "readTime": "7 min", "tags": ["FinOps", "S3", "Cost Optimization", "Data Lake"]},
]

TECH_SKILLS = {
    "Distributed Systems & SRE": ["High-Throughput Streaming", "Event-Driven Architecture", "FinOps", "Production SRE", "MTTR Optimization"],
    "Cloud & Infrastructure": ["AWS (S3, Lambda, Step Functions, SQS, Kinesis, IoT)", "Kubernetes", "Docker", "Helm", "CloudFormation / IaC", "CI/CD"],
    "Streaming & Edge Security": ["MQTT", "mTLS", "PKI / HSM", "Zero Trust Architecture", "CAN-Bus Diagnostics", "AWS IoT FleetWise"],
    "Programming & Data": ["Python", "Bash", "Go", "PostgreSQL", "AWS Athena", "SQL Tuning"],
    "Observability & AI Platform": ["Model Context Protocol (MCP)", "LLM Agentic Workflows", "Prometheus", "Grafana", "Kibana", "Distributed Tracing"],
}

TERMINAL_COMMANDS = {
    "help": "Available commands: help, bio, skills, projects, metrics, contact, clear, whoami",
    "whoami": "swaroop@autonomous-os:~$ Distributed Systems & Platform Engineer — Qualcomm | ex-Excelfore",
    "bio": "Building high-throughput data platforms and AI-assisted infrastructure. 65+ PB ADAS lakes, 1M+ vehicle fleets, MCP agentic automation.",
    "contact": "📧 lendiswaroop@gmail.com | 📱 +91-9738141464 | 💼 linkedin.com/in/swarooplendi | 🐙 github.com/swarooplendi",
    "metrics": "65+ PB managed | 1 PB/day throughput | 1M+ vehicles | 40% IaC velocity | 35% token savings | 99.95% uptime",
    "skills": "Distributed Systems | AWS | Kubernetes | MQTT + mTLS | MCP / LLM Agents | Python | PostgreSQL | Prometheus",
    "clear": "__CLEAR__",
}

# ─────────────────────────────────────────────
# API Routes
# ─────────────────────────────────────────────

@app.route("/api/profile")
def get_profile():
    return jsonify(OWNER_PROFILE)


@app.route("/api/projects")
def get_projects():
    featured_only = request.args.get("featured", "false").lower() == "true"
    data = [p for p in PROJECTS if p["featured"]] if featured_only else PROJECTS
    return jsonify(data)


@app.route("/api/projects/<project_id>")
def get_project(project_id):
    project = next((p for p in PROJECTS if p["id"] == project_id), None)
    if not project:
        abort(404)
    return jsonify(project)


@app.route("/api/journey")
def get_journey():
    return jsonify(JOURNEY)


@app.route("/api/articles")
def get_articles():
    return jsonify(ARTICLES)


@app.route("/api/articles/<article_id>")
def get_article(article_id):
    article = next((a for a in ARTICLES if a["id"] == article_id), None)
    if not article:
        abort(404)
    return jsonify(article)


@app.route("/api/skills")
def get_skills():
    return jsonify(TECH_SKILLS)


@app.route("/api/status")
def get_status():
    now = datetime.now()
    return jsonify({
        "time": now.strftime("%H:%M:%S"),
        "date": now.strftime("%a, %d %b %Y"),
        "timezone": "IST",
        "available": True,
        "status": "Open to Staff/Lead Platform Roles & Architecture Advisory",
        "osVersion": "v4.2.0-prod"
    })


@app.route("/api/terminal", methods=["POST"])
def terminal_command():
    data = request.get_json()
    cmd = (data.get("command", "") or "").strip().lower()
    
    if cmd in TERMINAL_COMMANDS:
        response = TERMINAL_COMMANDS[cmd]
    elif cmd.startswith("open "):
        app_name = cmd.replace("open ", "").strip()
        response = f"__OPEN_APP__{app_name}"
    elif cmd == "projects":
        response = "\n".join([f"→ [{p['id']}] {p['title']} ({p['org']})" for p in PROJECTS])
    else:
        response = f"Command not found: '{cmd}'. Type 'help' for available commands."
    
    return jsonify({"output": response, "timestamp": datetime.now().isoformat()})


@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json()
    
    # Basic honeypot check
    if data.get("website"):  # honeypot field
        return jsonify({"success": True})
    
    required = ["name", "email", "message"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400
    
    # In production: send email via SMTP / Sendgrid / Resend
    # For now: log and return success
    print(f"[CONTACT] From: {data.get('name')} <{data.get('email')}> | Subject: {data.get('subject', 'General')} | Message: {data.get('message', '')[:100]}")
    
    return jsonify({
        "success": True,
        "message": "Message received. Swaroop will respond within 24 hours."
    })


@app.route("/api/resume")
def download_resume():
    """Generate and serve a PDF resume."""
    try:
        from fpdf import FPDF
        
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 20)
        pdf.cell(0, 12, "SWAROOP LENDI", ln=True)
        pdf.set_font("Helvetica", size=12)
        pdf.cell(0, 8, "Distributed Systems & Platform Engineer", ln=True)
        pdf.cell(0, 8, "lendiswaroop@gmail.com | +91-9738141464 | Bangalore, India", ln=True)
        pdf.cell(0, 8, "linkedin.com/in/swarooplendi | github.com/swarooplendi", ln=True)
        pdf.ln(5)
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "CURRENT POSITION", ln=True)
        pdf.set_font("Helvetica", size=11)
        pdf.cell(0, 8, "DevSecOps & Platform Engineer — Qualcomm (Jun 2025–Present)", ln=True)
        pdf.multi_cell(0, 7, "• Built 65+ PB S3 ADAS data lake with 1 PB/day ingestion pipelines\n• Engineered MCP servers for AI-assisted infrastructure (40% faster IaC)\n• 22% FinOps S3 cost reduction while preserving 12h retrieval SLAs")
        pdf.ln(3)
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "PREVIOUS EXPERIENCE", ln=True)
        pdf.set_font("Helvetica", size=11)
        pdf.cell(0, 8, "DevOps & SRE Engineer — Excelfore (Sept 2021–Jun 2025)", ln=True)
        pdf.multi_cell(0, 7, "• Zero-trust mTLS/PKI platform for 1M+ connected vehicles\n• 99.95% production uptime on Kubernetes clusters\n• Global OTA firmware CDN with 70% bandwidth savings via delta compression")
        pdf.ln(3)
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "KEY METRICS", ln=True)
        pdf.set_font("Helvetica", size=11)
        for m in OWNER_PROFILE["metrics"]:
            pdf.cell(0, 7, f"• {m['value']} — {m['label']}", ln=True)
        
        os.makedirs("tmp", exist_ok=True)
        pdf_path = "tmp/swaroop_lendi_resume.pdf"
        pdf.output(pdf_path)
        return send_from_directory("tmp", "swaroop_lendi_resume.pdf", as_attachment=True)
    except ImportError:
        return jsonify({"error": "PDF generation requires fpdf2. Run: pip install fpdf2"}), 500


# ─────────────────────────────────────────────
# WebSocket Events
# ─────────────────────────────────────────────

@socketio.on("connect")
def on_connect():
    now = datetime.now()
    emit("system_status", {
        "time": now.strftime("%H:%M:%S"),
        "date": now.strftime("%a, %d %b %Y"),
        "timezone": "IST",
        "connected": True
    })


@socketio.on("ping_status")
def on_ping():
    now = datetime.now()
    emit("system_status", {
        "time": now.strftime("%H:%M:%S"),
        "date": now.strftime("%a, %d %b %Y"),
        "timezone": "IST",
    })


# ─────────────────────────────────────────────
# Serve React Frontend (Production)
# ─────────────────────────────────────────────

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    dist_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(dist_path):
        return send_from_directory(app.static_folder, path)
    index = os.path.join(app.static_folder, "index.html")
    if os.path.exists(index):
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({"status": "Autonomous OS API running. Build the React frontend first."}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV", "development") == "development"
    socketio.run(app, host="0.0.0.0", port=port, debug=debug, allow_unsafe_werkzeug=True)

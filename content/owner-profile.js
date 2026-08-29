/**
 * Canonical owner profile data contract for Autonomous OS
 * Owner: Swaroop Lendi (Distributed Systems & Platform Engineer)
 */

export const ownerProfile = {
  identity: {
    fullName: "Swaroop Lendi",
    shortName: "Swaroop",
    osName: "Autonomous OS",
    version: "v4.2.0-prod",
    domain: "swarooplendi.dev",
    location: "Bangalore, India",
    timezone: "Asia/Kolkata (IST • UTC+5:30)",
    email: "lendiswaroop@gmail.com",
    phone: "+91-9738141464",
    linkedin: "https://linkedin.com/in/swarooplendi",
    github: "https://github.com/swarooplendi",
    whatsapp: "https://wa.me/919738141464?text=Hi%20Swaroop%2C%20reaching%20out%20regarding%20Platform%20Engineering%20%26%20Distributed%20Systems",
    profession: "Distributed Systems & Platform Engineer",
    positioningStatement: "Architecting high-throughput data platforms, 65+ PB ADAS data lakes, AI-assisted MCP infrastructure, and zero-trust connected vehicle ecosystems.",
    roles: [
      "Distributed Systems Architect",
      "DevSecOps & Platform Engineer",
      "ADAS Telemetry Specialist",
      "AI / MCP Infrastructure Builder",
      "Production SRE Lead"
    ],
    headline: "Building Resilient Platforms at Massive Data Scale",
    intro: "5+ years engineering large-scale cloud infrastructure, high-throughput streaming pipelines, and AI-assisted developer platforms across autonomous driving and 1M+ connected vehicle fleets.",
    currentScope: "Qualcomm — DevSecOps & Platform Engineer (ADAS & AI Platform Architecture)",
    previousScope: "Excelfore — DevOps & SRE Engineer (1M+ Connected Vehicle Fleet Platform)",
    education: "B.E. in Computer Science — Visvesvaraya Technological University, Bangalore (2021)"
  },

  imageGeneration: {
    mode: "approved-assets-only",
    likenessNotes: "Clean Lucide vector icon family, technical architecture blueprints, telemetry HUD badges, and high-tech Cyber Probe companion.",
    requiredOutputs: ["vector-icons", "architecture-blueprints", "cyber-companion", "telemetry-hud"],
    finalApprovalBy: "Swaroop Lendi"
  },

  conversion: {
    primaryLabel: "Schedule Consultation",
    primaryUrl: "mailto:lendiswaroop@gmail.com?subject=Platform%20Engineering%20Consultation",
    secondaryLabel: "WhatsApp Quick Connect",
    secondaryUrl: "https://wa.me/919738141464?text=Hi%20Swaroop%2C%20let%27s%20connect%20regarding%20Platform%20Architecture",
    email: "lendiswaroop@gmail.com",
    phone: "+91-9738141464",
    bookingCopy: "Reach Swaroop directly for Staff/Lead Platform roles or High-Throughput Infrastructure Architecture consulting.",
    emergencyLabel: "URGENT INFRASTRUCTURE / PLATFORM BRIEF"
  },

  metrics: [
    {
      value: "65+ PB",
      label: "Data Lake Managed",
      detail: "S3-based storage for ADAS perception and AI training workloads at Qualcomm",
      status: "verified",
      source: "Qualcomm ADAS Platform Production Metrics",
      public: true,
      lastVerified: "2026-08-01"
    },
    {
      value: "1 PB/day",
      label: "Vehicle Telemetry Moved",
      detail: "High-throughput data transfers across ~1,000 global test fleet vehicles",
      status: "verified",
      source: "Distributed Ingestion Pipeline Operations",
      public: true,
      lastVerified: "2026-08-01"
    },
    {
      value: "1M+ Vehicles",
      label: "Connected Fleet Scale",
      detail: "Zero-trust edge security & streaming ingestion via MQTT, mTLS, and AWS IoT FleetWise",
      status: "verified",
      source: "Excelfore Connected Vehicle Platform",
      public: true,
      lastVerified: "2025-06-01"
    },
    {
      value: "40%",
      label: "IaC Velocity Acceleration",
      detail: "Internal Model Context Protocol (MCP) servers exposing schemas & telemetry to LLM agents",
      status: "verified",
      source: "AI-Assisted Infrastructure Initiative",
      public: true,
      lastVerified: "2026-07-15"
    },
    {
      value: "35%",
      label: "LLM Token Cost Reduction",
      detail: "Intelligent context pruning, chunking, and log structuring before agent execution",
      status: "verified",
      source: "Context & Token Optimization Engine",
      public: true,
      lastVerified: "2026-07-15"
    },
    {
      value: "22%",
      label: "FinOps S3 Spend Savings",
      detail: "Automated lifecycle tiering while preserving strict 12-hour data-retrieval SLA",
      status: "verified",
      source: "Cloud Infrastructure FinOps Program",
      public: true,
      lastVerified: "2026-05-30"
    },
    {
      value: "99.95%",
      label: "Production Uptime",
      detail: "Highly available concurrent microservices on production Kubernetes under peak loads",
      status: "verified",
      source: "Excelfore SRE Production Telemetry",
      public: true,
      lastVerified: "2025-05-01"
    },
    {
      value: "30%",
      label: "MTTR Reduction",
      detail: "Centralized logging, Prometheus/Kibana proactive anomaly detection dashboards",
      status: "verified",
      source: "SRE Incident Management Operations",
      public: true,
      lastVerified: "2026-06-01"
    }
  ],

  technicalSkills: {
    "Distributed Systems & SRE": [
      "High-Throughput Data Platforms", "Event-Driven Architecture", "Reliability Engineering", 
      "Performance & Network Tuning", "FinOps & Cost Optimization", "Production SRE"
    ],
    "Cloud & Infrastructure": [
      "AWS (S3, Lambda, Step Functions, SQS, Kinesis)", "AWS IoT Core FleetWise", 
      "Kubernetes", "Docker", "Helm", "Service Mesh", "CloudFormation / IaC", "CI/CD Pipelines"
    ],
    "Streaming & Edge Security": [
      "MQTT", "Pub/Sub", "Zero Trust Architecture", "mTLS", "PKI Device Identity", "CAN-Bus Diagnostics"
    ],
    "Programming & Data": [
      "Python", "Bash", "PostgreSQL", "AWS Athena", "Distributed Data Lakes", "SQL Tuning"
    ],
    "Observability & AI Platform": [
      "Model Context Protocol (MCP)", "LLM Agentic Workflows", "Context/Token Optimization", 
      "Prometheus", "Grafana", "Kibana", "Distributed Tracing"
    ]
  },

  companion: {
    name: "Lendi-Bot",
    type: "Autonomous Telemetry Cyber Drone",
    states: ["idle", "happy", "alert", "sleeping"],
    defaultState: "idle",
    soundEnabled: false,
    pingTemplate: "System Alert: Telemetry connection active. Swaroop is currently open for Lead Platform roles & Architecture advisory."
  },

  legal: {
    copyrightOwner: "Swaroop Lendi",
    metricDisclaimer: "Metrics reflect verified production operations, telemetry records, and platform measurements across Qualcomm and Excelfore engineering scopes."
  }
};

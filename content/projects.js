/**
 * Flagship systems and projects portfolio data
 */

export const projects = [
  {
    id: "qualcomm-adas-telemetry",
    title: "Global ADAS Telemetry & 65+ PB Data Lake Platform",
    organization: "Qualcomm",
    role: "DevSecOps & Platform Engineer",
    dates: "June 2025 – Present",
    category: "Autonomous Driving / High-Throughput Platform",
    tagline: "Operating 1 PB/day ingestion pipelines and multi-petabyte S3 data lake for autonomous perception AI training.",
    featured: true,
    badges: ["65+ PB Scale", "1 PB/day Throughput", "AWS Lambda + SQS", "Sub-1h SLA"],
    challenge: "Autonomous test vehicles across global locations collect massive quantities of sensor, LiDAR, radar, and camera telemetry. Ingesting and processing this volume under tight SLAs without overwhelming network ingress or blowing cloud budgets required an architectural overhaul.",
    architecture: {
      ingestion: "Multi-region S3 ingestion gateways with dynamic queue backpressure and switch capacity tuning.",
      orchestration: "Serverless event-driven AWS Step Functions, Lambda, and SQS worker pools processing 100K–200K telemetry files/annotations daily.",
      storageTiering: "Automated S3 lifecycle management with intelligent tiering, slashing infrastructure costs by 22% while preserving 12-hour retrieval guarantees.",
      database: "Migrated metadata tracking from flat-file Athena queries to indexed PostgreSQL clusters, unlocking 4x transactional throughput."
    },
    metrics: [
      { label: "Daily Data Ingestion", value: "Up to 1 PB/day" },
      { label: "Total Lake Capacity", value: "65+ Petabytes" },
      { label: "Fleet Scale", value: "~1,000 Global Vehicles" },
      { label: "Daily File Processing", value: "100k - 200k files" },
      { label: "FinOps Cost Savings", value: "22% S3 Reduction" }
    ],
    techStack: ["AWS S3", "AWS Lambda", "AWS Step Functions", "Amazon SQS", "PostgreSQL", "CloudFormation", "Python", "Prometheus", "Kibana"],
    status: "Production Active"
  },
  {
    id: "qualcomm-ai-mcp-infra",
    title: "AI-Assisted Infrastructure & Model Context Protocol (MCP) Platform",
    organization: "Qualcomm",
    role: "DevSecOps & Platform Engineer",
    dates: "2025 – Present",
    category: "AI Developer Platforms / Agentic Infrastructure",
    tagline: "Custom MCP servers and token context pruning engine accelerating IaC generation by 40%.",
    featured: true,
    badges: ["Model Context Protocol", "Agentic Workflows", "40% Velocity Boost", "35% Token Savings"],
    challenge: "Complex cloud infrastructure provisioning across distributed teams suffered from repetitive boilerplate, slow manual troubleshooting, and high LLM token costs when exposing raw architectural logs to developer agents.",
    architecture: {
      mcpServers: "Engineered secure internal MCP servers exposing live platform schemas, infrastructure repositories, and telemetry feeds directly to AI coding agents.",
      tokenOptimization: "Built a context assembly pre-processor that prunes, chunks, and structures raw system logs and CloudFormation templates prior to agent execution, cutting token consumption by 35%.",
      security: "Enforced zero-trust RBAC on MCP tool executions, ensuring developer agents operate strictly within verified blast-radius parameters."
    },
    metrics: [
      { label: "IaC Generation Cycles", value: "40% Faster" },
      { label: "Token Consumption", value: "35% Reduced" },
      { label: "Troubleshooting MTTR", value: "30% Improvement" }
    ],
    techStack: ["Model Context Protocol (MCP)", "Python", "LLM Tooling", "CloudFormation", "Context Pruning Engine", "Docker"],
    status: "Production Active"
  },
  {
    id: "excelfore-zero-trust-telemetry",
    title: "Zero-Trust Connected Vehicle Telemetry Platform (1M+ Fleet)",
    organization: "Excelfore",
    role: "DevOps & SRE Engineer",
    dates: "Sept 2021 – June 2025",
    category: "Edge IoT / Distributed Streaming",
    tagline: "Zero-trust MQTT/mTLS telemetry ingestion and Kinesis streaming for over 1 million production vehicles.",
    featured: true,
    badges: ["1M+ Connected Vehicles", "mTLS & PKI Security", "AWS IoT FleetWise", "99.95% Uptime"],
    challenge: "Connecting over a million consumer and commercial vehicles to the cloud required impenetrable edge security, low-latency CAN-bus diagnostic streaming, and rock-solid platform reliability.",
    architecture: {
      security: "Architected a zero-trust device identity infrastructure utilizing Mutual TLS (mTLS), public key infrastructure (PKI), and MQTT over secure TLS.",
      streaming: "Integrated CAN-bus high-frequency diagnostics with AWS IoT Core FleetWise and Amazon Kinesis streaming pipelines for real-time telemetry processing.",
      kubernetes: "Designed and operated containerized microservices on Kubernetes, maintaining 99.95% production uptime under severe peak traffic loads."
    },
    metrics: [
      { label: "Active Connected Vehicles", value: "1,000,000+" },
      { label: "Platform Availability", value: "99.95% SLA" },
      { label: "Security Standard", value: "mTLS + Hardware PKI" }
    ],
    techStack: ["Kubernetes", "AWS IoT Core FleetWise", "Amazon Kinesis", "MQTT", "mTLS / PKI", "Docker", "Helm", "Prometheus"],
    status: "Production Verified"
  },
  {
    id: "excelfore-ota-firmware-cdn",
    title: "Resilient Global OTA Firmware Distribution Architecture",
    organization: "Excelfore",
    role: "DevOps & SRE Engineer",
    dates: "2022 – 2025",
    category: "Over-The-Air (OTA) Updates / Global CDN",
    tagline: "Highly available, fault-tolerant Over-The-Air firmware updates across global automotive fleets.",
    featured: true,
    badges: ["Global CDN", "Automotive OTA", "Fault Tolerant", "Diff Delivery"],
    challenge: "Delivering multi-gigabyte ECU and infotainment firmware binaries reliably to vehicles across intermittent cellular networks globally without bricking edge devices.",
    architecture: {
      cdnDistribution: "Engineered global multi-region edge caching with resume-on-disconnect chunked transfer.",
      deltaCompression: "Implemented binary diff algorithm pipelines to minimize cellular bandwidth payload by up to 70%.",
      integrityVerification: "Cryptographic signature validation and automated rollback states on target automotive gateways."
    },
    metrics: [
      { label: "Update Delivery Success", value: "99.98%" },
      { label: "Bandwidth Savings", value: "Up to 70% with Delta Compression" },
      { label: "Target Fleet", value: "Global Commercial & Consumer" }
    ],
    techStack: ["Global CDN", "AWS CloudFront", "S3", "Kubernetes", "Binary Diffing", "Python", "Go"],
    status: "Production Verified"
  }
];

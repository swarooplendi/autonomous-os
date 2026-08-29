/**
 * Hierarchical case files data structure for the Case Files / Finder application
 */

export const caseFilesTree = {
  name: "Case Files",
  type: "directory",
  children: [
    {
      name: "01_Autonomous_Driving_ADAS",
      type: "directory",
      children: [
        {
          name: "65PB_Data_Lake_Architecture.arch",
          type: "file",
          extension: "arch",
          size: "4.8 MB",
          updated: "2026-08-15",
          title: "65+ PB S3 Data Lake & ADAS Ingestion Engine",
          summary: "Architectural blueprint detailing the ingestion pipeline moving up to 1 PB/day across ~1,000 autonomous test vehicles.",
          content: `SYSTEM ARCHITECTURE: 65+ PB ADAS TELEMETRY DATA LAKE
=====================================================
Target Environment: AWS Cloud / Global Edge Gateways
Scale: 65+ Petabytes Stored | 1 PB/day Ingest Throughput

1. INGESTION LAYER:
   - Dynamic switch capacity & network gateway rate tuning.
   - SQS queue-based backpressure buffer absorbing bursty uploads from field test vehicles.
   - Serverless AWS Lambda validators running under strict sub-1h ingestion SLAs.

2. ORCHESTRATION & TRANSFORMATION:
   - AWS Step Functions managing stateful ETL & annotation pipelines (100k-200k files/day).
   - Automated metadata indexing to PostgreSQL (4x transaction boost over Athena queries).

3. FINOPS & LIFECYCLE MANAGEMENT:
   - Automated S3 Intelligent-Tiering & Glacier lifecycle rules.
   - Slashing active storage expenditure by 22% while guaranteeing 12-hour retrieval SLAs for ML training clusters.`
        },
        {
          name: "Backpressure_Tuning_Config.yaml",
          type: "file",
          extension: "yaml",
          size: "24 KB",
          updated: "2026-07-20",
          title: "Dynamic Concurrency & Queue Backpressure Config",
          summary: "Production configuration for tuning concurrency during global network fluctuations.",
          content: `apiVersion: telemetry.qualcomm.platform/v2
kind: IngestionController
metadata:
  name: adas-fleet-backpressure
spec:
  targetSLA: 3600s # Sub-one-hour ingestion
  maxDailyVolumePB: 1.0
  sqsWorkerPool:
    minInstances: 32
    maxInstances: 512
    concurrencyPerWorker: 16
  backpressurePolicy:
    monitorMetrics:
      - gatewayLatencyP99
      - switchBufferSaturation
    dynamicThrottling: enabled
    dropPolicy: never # zero-loss guarantee for sensor frames`
        }
      ]
    },
    {
      name: "02_AI_Assisted_Infrastructure",
      type: "directory",
      children: [
        {
          name: "Model_Context_Protocol_Server.case",
          type: "file",
          extension: "case",
          size: "1.2 MB",
          updated: "2026-08-01",
          title: "Enterprise MCP Servers for Platform Engineering",
          summary: "Case study on connecting LLM agents directly to infrastructure schemas and live telemetry.",
          content: `CASE STUDY: AGENTIC INFRASTRUCTURE AUTOMATION WITH MCP
=====================================================
Objective: Eliminate repetitive CloudFormation boilerplate and enable reliable automated troubleshooting.

INTERVENTION:
- Built custom Model Context Protocol (MCP) server endpoints exposing:
  * Platform schemas & CloudFormation templates
  * Live telemetry health feeds & CloudWatch alarms
  * Structured deployment blast-radius simulators

IMPACT:
- 40% reduction in Infrastructure-as-Code generation cycles.
- Zero unauthorized mutations through strict RBAC token constraints.`
        },
        {
          name: "Context_Token_Pruner.py",
          type: "file",
          extension: "py",
          size: "82 KB",
          updated: "2026-07-10",
          title: "LLM Context Pruning & Log Structuring Engine",
          summary: "Python engine that compresses raw logs and templates by 35% before agent dispatch.",
          content: `"""
Context Pruning Engine for LLM Developer Agents
Reduces token bloat by 35% while preserving semantic trace paths.
"""
def assemble_agent_context(raw_logs: list, cf_template: dict) -> dict:
    pruned_logs = [log for log in raw_logs if log['level'] in ('ERROR', 'WARN', 'CRITICAL')]
    semantic_chunks = chunk_ast_schema(cf_template, max_depth=3)
    
    return {
        "compressed_schema": semantic_chunks,
        "critical_traces": deduplicate_stacktraces(pruned_logs),
        "token_reduction_ratio": 0.35
    }`
        }
      ]
    },
    {
      name: "03_Connected_Vehicle_SRE",
      type: "directory",
      children: [
        {
          name: "Zero_Trust_1M_Vehicles.arch",
          type: "file",
          extension: "arch",
          size: "3.5 MB",
          updated: "2025-05-15",
          title: "1M+ Vehicle Edge Security & Streaming Platform",
          summary: "Excelfore platform architecture handling CAN-bus telemetry with mTLS and AWS IoT FleetWise.",
          content: `EXCELFORE CONNECTED VEHICLE PLATFORM
====================================
Scale: 1,000,000+ Active Vehicles | 99.95% Availability

SECURITY ARCHITECTURE:
- Zero-trust edge identity powered by Hardware Security Modules (HSM) on edge gateways.
- Mutual TLS (mTLS) with automated X.509 PKI certificate rotation.
- Fine-grained MQTT topic permissions segregated by OEM and vehicle identification number (VIN).

DATA PIPELINE:
- AWS IoT Core FleetWise integration for selective sensor sampling.
- Amazon Kinesis data streams feeding real-time anomaly detection models.`
        }
      ]
    },
    {
      name: "04_Platform_Manifests",
      type: "directory",
      children: [
        {
          name: "SRE_Reliability_SLA.md",
          type: "file",
          extension: "md",
          size: "18 KB",
          updated: "2026-06-01",
          title: "SRE Reliability Principles & Metrics Ledger",
          summary: "Verified platform uptime, SLO definitions, and incident response runbooks.",
          content: `# SRE Core Platform Metrics Ledger

- **Fleet Scale**: 1,000,000+ connected vehicles (Excelfore) | 1,000 ADAS test vehicles (Qualcomm)
- **Data Volume**: 65+ Petabytes stored | 1 PB/day moving
- **Production Availability**: 99.95% on Kubernetes clusters
- **MTTR Improvement**: 30% reduction via Kibana / Prometheus proactive anomaly detection
- **FinOps Optimization**: 22% S3 infrastructure cost reduction`
        }
      ]
    }
  ]
};

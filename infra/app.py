#!/usr/bin/env python3
"""
Autonomous OS — AWS CDK Infrastructure
Swaroop Lendi Personal Portfolio

Architecture (AWS Free Tier — $0/month for low traffic):
  - AWS Lambda (1M requests/month free) — Flask backend via Mangum
  - API Gateway HTTP API (1M calls/month free for 12 months)
  - S3 (5 GB free) — React build artifacts stored in Amplify
  - AWS Amplify (1000 build-mins/month + 15GB served/month free)
  - CloudWatch Logs (10 GB/month free)
"""

import aws_cdk as cdk
from autonomous_os_stack import AutonomousOsStack

app = cdk.App()

AutonomousOsStack(
    app,
    "AutonomousOsStack",
    env=cdk.Environment(
        account=app.node.try_get_context("account"),
        region=app.node.try_get_context("region") or "ap-south-1",
    ),
    description="Autonomous OS — Swaroop Lendi Portfolio (Flask Lambda + Amplify React)",
)

app.synth()

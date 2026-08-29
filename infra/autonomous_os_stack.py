"""
Autonomous OS — AWS CDK Stack
Flask backend on AWS Lambda + HTTP API Gateway
React frontend on AWS Amplify

Estimated monthly cost on AWS Free Tier: $0.00
- Lambda: 1M requests/month + 400,000 GB-seconds free forever
- API Gateway HTTP API: 1M calls/month free (12 months)
- AWS Amplify: 1000 build minutes + 15 GB data served free
- CloudWatch: 10 GB log storage free
"""

from __future__ import annotations

import os
import json
import aws_cdk as cdk
from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_lambda as lambda_,
    aws_apigatewayv2 as apigw,
    aws_apigatewayv2_integrations as integrations,
    aws_amplify as amplify,
    aws_iam as iam,
    aws_logs as logs,
    CfnOutput,
)
from constructs import Construct


class AutonomousOsStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # ─────────────────────────────────────────────
        # 1. Lambda Function — Flask app via Mangum
        # ─────────────────────────────────────────────
        flask_fn = lambda_.Function(
            self,
            "AutonomousOsApi",
            function_name="autonomous-os-api",
            runtime=lambda_.Runtime.PYTHON_3_12,
            handler="lambda_handler.handler",
            code=lambda_.Code.from_asset(
                "../backend",
                exclude=["*.pyc", "__pycache__", ".env", "tmp/"],
            ),
            timeout=Duration.seconds(29),
            memory_size=256,
            environment={
                "FLASK_ENV": "production",
                "SECRET_KEY": self.node.try_get_context("secret_key") or "autonomous-os-prod",
                "FRONTEND_URL": self.node.try_get_context("frontend_url") or "*",
            },
            log_retention=logs.RetentionDays.ONE_MONTH,
            description="Autonomous OS Flask API (Mangum ASGI adapter)",
        )

        # ─────────────────────────────────────────────
        # 2. API Gateway HTTP API ($0 for free tier)
        # ─────────────────────────────────────────────
        http_api = apigw.HttpApi(
            self,
            "AutonomousOsHttpApi",
            api_name="autonomous-os-api",
            description="Autonomous OS — Flask API Gateway",
            cors_preflight=apigw.CorsPreflightOptions(
                allow_headers=["Content-Type", "Authorization"],
                allow_methods=[
                    apigw.CorsHttpMethod.GET,
                    apigw.CorsHttpMethod.POST,
                    apigw.CorsHttpMethod.OPTIONS,
                ],
                allow_origins=["*"],
                max_age=Duration.days(1),
            ),
        )

        lambda_integration = integrations.HttpLambdaIntegration(
            "FlaskIntegration",
            flask_fn,
        )

        # Route all /api/* to Lambda
        http_api.add_routes(
            path="/api/{proxy+}",
            methods=[apigw.HttpMethod.ANY],
            integration=lambda_integration,
        )

        # ─────────────────────────────────────────────
        # 3. AWS Amplify App — React Frontend (Free Tier)
        # ─────────────────────────────────────────────
        build_spec = {
            "version": "1",
            "frontend": {
                "phases": {
                    "preBuild": {
                        "commands": ["cd frontend", "npm ci"]
                    },
                    "build": {
                        "commands": [
                            f"VITE_API_URL={http_api.url} npm run build"
                        ]
                    }
                },
                "artifacts": {
                    "baseDirectory": "frontend/dist",
                    "files": ["**/*"]
                },
                "cache": {
                    "paths": ["frontend/node_modules/**/*"]
                }
            }
        }

        github_token = (
            self.node.try_get_context("github_token")
            or os.environ.get("GITHUB_TOKEN")
            or ""
        )

        amplify_app = amplify.CfnApp(
            self,
            "AutonomousOsAmplifyApp",
            name="autonomous-os",
            description="Swaroop Lendi — Autonomous OS Portfolio",
            repository="https://github.com/swarooplendi/autonomous-os",
            access_token=github_token,
            build_spec=json.dumps(build_spec),
            environment_variables=[
                amplify.CfnApp.EnvironmentVariableProperty(
                    name="VITE_API_URL",
                    value=http_api.url or "",
                ),
            ],
        )

        main_branch = amplify.CfnBranch(
            self,
            "AutonomousOsMainBranch",
            app_id=amplify_app.attr_app_id,
            branch_name="main",
            stage="PRODUCTION",
            enable_auto_build=True,
            description="Production main branch deployment",
        )

        # ─────────────────────────────────────────────
        # 4. Outputs
        # ─────────────────────────────────────────────
        CfnOutput(
            self,
            "ApiGatewayUrl",
            value=http_api.url or "",
            description="Flask API Gateway URL",
            export_name="AutonomousOsApiUrl",
        )

        CfnOutput(
            self,
            "AmplifyAppId",
            value=amplify_app.attr_app_id,
            description="Amplify App ID",
        )

        CfnOutput(
            self,
            "AmplifyDefaultDomain",
            value=f"https://main.{amplify_app.attr_default_domain}",
            description="Amplify Frontend URL",
            export_name="AutonomousOsFrontendUrl",
        )

        CfnOutput(
            self,
            "LambdaFunctionName",
            value=flask_fn.function_name,
            description="Lambda function name",
        )

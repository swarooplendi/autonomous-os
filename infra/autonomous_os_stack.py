"""
Autonomous OS — AWS CDK Stack
Flask backend on Lambda + API Gateway (HTTP API)
React frontend on AWS Amplify

Estimated monthly cost on AWS Free Tier: $0.00
- Lambda: 1M requests/month + 400,000 GB-seconds free
- API Gateway HTTP API: 1M calls/month free (12 months)
- Amplify: 1000 build minutes + 15 GB data served free
- CloudWatch: 10 GB log storage free
"""

from __future__ import annotations

import os
import aws_cdk as cdk
from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_lambda as lambda_,
    aws_apigatewayv2 as apigw,
    aws_apigatewayv2_integrations as integrations,
    aws_amplify_alpha as amplify,
    aws_iam as iam,
    aws_logs as logs,
    aws_secretsmanager as secretsmanager,
    CfnOutput,
)
from constructs import Construct


class AutonomousOsStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # ─────────────────────────────────────────────
        # 1. Lambda Layer — Python dependencies
        # ─────────────────────────────────────────────
        deps_layer = lambda_.LayerVersion(
            self,
            "AutonomousOsDepsLayer",
            code=lambda_.Code.from_asset(
                "../backend",
                bundling=cdk.BundlingOptions(
                    image=lambda_.Runtime.PYTHON_3_12.bundling_image,
                    command=[
                        "bash", "-c",
                        (
                            "pip install -r requirements-lambda.txt "
                            "-t /asset-output/python --no-cache-dir --quiet"
                        ),
                    ],
                ),
            ),
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_12],
            description="Autonomous OS — Flask + Mangum + fpdf2 dependencies",
            removal_policy=RemovalPolicy.DESTROY,
        )

        # ─────────────────────────────────────────────
        # 2. Lambda Function — Flask app via Mangum
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
            layers=[deps_layer],
            timeout=Duration.seconds(29),        # API GW max timeout
            memory_size=256,                     # free tier: 400k GB-sec/month
            environment={
                "FLASK_ENV": "production",
                "SECRET_KEY": self.node.try_get_context("secret_key") or "autonomous-os-prod",
                "FRONTEND_URL": self.node.try_get_context("frontend_url") or "*",
            },
            log_retention=logs.RetentionDays.ONE_MONTH,
            description="Autonomous OS Flask API (Mangum ASGI adapter)",
        )

        # ─────────────────────────────────────────────
        # 3. API Gateway HTTP API — $0 for first 12 months
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

        # Route all /api/* traffic to Lambda
        http_api.add_routes(
            path="/api/{proxy+}",
            methods=[apigw.HttpMethod.ANY],
            integration=lambda_integration,
        )

        # ─────────────────────────────────────────────
        # 4. AWS Amplify App — React Frontend
        #    Free tier: 1000 build-min/month, 15GB served
        # ─────────────────────────────────────────────
        amplify_app = amplify.App(
            self,
            "AutonomousOsAmplify",
            app_name="autonomous-os",
            description="Swaroop Lendi — Autonomous OS Portfolio",
            source_code_provider=amplify.GitHubSourceCodeProvider(
                owner="swarooplendi",
                repository="autonomous-os",
                oauth_token=cdk.SecretValue.secrets_manager(
                    "autonomous-os/github-token",
                    json_field="token",
                ),
            ),
            build_spec=amplify.BuildSpec.from_object_to_plain_text({
                "version": "1",
                "applications": [
                    {
                        "frontend": {
                            "phases": {
                                "preBuild": {
                                    "commands": ["cd frontend && npm ci"]
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
                ]
            }),
            environment_variables={
                "VITE_API_URL": http_api.url or "",
            },
        )

        # Connect main branch → production Amplify deployment
        main_branch = amplify_app.add_branch(
            "main",
            branch_name="main",
            stage=amplify.BranchType.PRODUCTION,
            auto_build=True,
            description="Production deployment",
        )

        # ─────────────────────────────────────────────
        # 5. Outputs
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
            value=amplify_app.app_id,
            description="Amplify App ID",
        )

        CfnOutput(
            self,
            "AmplifyDefaultDomain",
            value=f"https://main.{amplify_app.default_domain}",
            description="Amplify Frontend URL",
            export_name="AutonomousOsFrontendUrl",
        )

        CfnOutput(
            self,
            "LambdaFunctionName",
            value=flask_fn.function_name,
            description="Lambda function name",
        )

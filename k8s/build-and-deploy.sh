#!/bin/bash

# Build and Deploy Script for Comparateur App on Kubernetes
set -e

echo "🚀 Starting build and deployment process..."

# Configuration
REGISTRY="your-registry.com"  # Change this to your Docker registry
TAG="latest"
NAMESPACE="comparateur-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if docker is available
if ! command -v docker &> /dev/null; then
    print_error "docker is not installed or not in PATH"
    exit 1
fi

# Step 1: Build Docker images
echo "📦 Building Docker images..."

# Build backend image
print_status "Building backend image..."
cd ../back
docker build -t ${REGISTRY}/comparateur-backend:${TAG} .
cd ../k8s

# Build frontend image
print_status "Building frontend image..."
cd ../frontend
docker build -t ${REGISTRY}/comparateur-frontend:${TAG} .
cd ../k8s

# Step 2: Push images to registry (uncomment if using remote registry)
# echo "🚢 Pushing images to registry..."
# docker push ${REGISTRY}/comparateur-backend:${TAG}
# docker push ${REGISTRY}/comparateur-frontend:${TAG}

# Step 3: Deploy to Kubernetes
echo "☸️  Deploying to Kubernetes..."

# Apply all Kubernetes resources
kubectl apply -f deploy-all.yaml

# Wait for deployments to be ready
print_status "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mysql -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/backend -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/frontend -n ${NAMESPACE}

# Get service information
echo "📊 Getting service information..."
kubectl get services -n ${NAMESPACE}

# Get pod status
echo "🔍 Pod status:"
kubectl get pods -n ${NAMESPACE}

# Get ingress information
echo "🌐 Ingress information:"
kubectl get ingress -n ${NAMESPACE}

print_status "Deployment completed successfully!"
print_warning "Note: If using LoadBalancer, wait for external IP to be assigned"
print_warning "For local testing, you may need to add 'comparateur.local' to your /etc/hosts file"

echo "🎉 Your application should be accessible at: http://comparateur.local"
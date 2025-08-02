#!/bin/bash

# Cleanup script for Comparateur App Kubernetes deployment
set -e

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

echo "🧹 Cleaning up Comparateur App deployment..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed or not in PATH"
    exit 1
fi

# Check if namespace exists
if ! kubectl get namespace ${NAMESPACE} &> /dev/null; then
    print_warning "Namespace ${NAMESPACE} does not exist. Nothing to clean up."
    exit 0
fi

# Delete all resources in the namespace
print_status "Deleting all resources in namespace ${NAMESPACE}..."
kubectl delete all --all -n ${NAMESPACE}

# Delete PVCs
print_status "Deleting Persistent Volume Claims..."
kubectl delete pvc --all -n ${NAMESPACE}

# Delete ConfigMaps and Secrets
print_status "Deleting ConfigMaps and Secrets..."
kubectl delete configmap --all -n ${NAMESPACE}
kubectl delete secret --all -n ${NAMESPACE}

# Delete Ingress
print_status "Deleting Ingress resources..."
kubectl delete ingress --all -n ${NAMESPACE}

# Wait a moment for resources to be deleted
sleep 5

# Delete the namespace
print_status "Deleting namespace ${NAMESPACE}..."
kubectl delete namespace ${NAMESPACE}

print_status "Cleanup completed successfully!"
echo "🎉 All Comparateur App resources have been removed from Kubernetes."
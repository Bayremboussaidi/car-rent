# Kubernetes Deployment Guide for Comparateur App

This directory contains all the necessary Kubernetes manifests and scripts to deploy your Comparateur application (Angular frontend + Spring Boot backend + MySQL database) to a Kubernetes cluster.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Kubernetes cluster** (local or cloud-based)
   - [Minikube](https://minikube.sigs.k8s.io/docs/) for local development
   - [Kind](https://kind.sigs.k8s.io/) for local testing
   - Cloud providers: EKS, GKE, AKS, etc.

2. **Tools installed:**
   - `kubectl` - Kubernetes command-line tool
   - `docker` - For building container images
   - `git` - For version control

3. **Optional components:**
   - **Ingress Controller** (nginx-ingress recommended)
   - **Storage Class** configured for persistent volumes
   - **LoadBalancer** or external IP for frontend access

## 🏗️ Architecture Overview

The deployment includes:

- **Frontend**: Angular application (2 replicas)
- **Backend**: Spring Boot application (2 replicas)
- **Database**: MySQL 8.0 (1 replica with persistent storage)
- **Networking**: Services for internal communication, Ingress for external access
- **Storage**: Persistent Volume Claim for MySQL data
- **Configuration**: ConfigMaps and Secrets for environment variables

## 📁 File Structure

```
k8s/
├── deploy-all.yaml           # All-in-one deployment file
├── namespace.yaml            # Application namespace
├── mysql-configmap.yaml      # MySQL configuration
├── mysql-secret.yaml         # MySQL passwords
├── mysql-pvc.yaml           # MySQL persistent storage
├── mysql-deployment.yaml    # MySQL deployment
├── mysql-service.yaml       # MySQL service
├── backend-configmap.yaml   # Backend configuration
├── backend-secret.yaml      # Backend secrets
├── backend-deployment.yaml  # Backend deployment
├── backend-service.yaml     # Backend service
├── frontend-deployment.yaml # Frontend deployment
├── frontend-service.yaml    # Frontend service
├── ingress.yaml             # Ingress configuration
├── build-and-deploy.sh      # Automated deployment script
├── cleanup.sh               # Cleanup script
└── README.md                # This file
```

## 🚀 Quick Start

### Option 1: One-Command Deployment

```bash
# Make the script executable
chmod +x build-and-deploy.sh

# Run the automated deployment
./build-and-deploy.sh
```

### Option 2: Manual Step-by-Step Deployment

1. **Build Docker images:**
   ```bash
   # Build backend image
   cd ../back
   docker build -t comparateur-backend:latest .
   
   # Build frontend image
   cd ../frontend
   docker build -t comparateur-frontend:latest .
   cd ../k8s
   ```

2. **Deploy to Kubernetes:**
   ```bash
   # Deploy all resources
   kubectl apply -f deploy-all.yaml
   
   # Or deploy individually
   kubectl apply -f namespace.yaml
   kubectl apply -f mysql-*.yaml
   kubectl apply -f backend-*.yaml
   kubectl apply -f frontend-*.yaml
   kubectl apply -f ingress.yaml
   ```

3. **Monitor deployment:**
   ```bash
   # Check pod status
   kubectl get pods -n comparateur-app
   
   # Check services
   kubectl get services -n comparateur-app
   
   # Check ingress
   kubectl get ingress -n comparateur-app
   ```

## 🔧 Configuration

### Environment Variables

Update the following files based on your environment:

**backend-configmap.yaml:**
- `SPRING_WEB_CORS_ALLOWED_ORIGINS`: Update with your frontend URL
- Database connection settings if needed

**ingress.yaml:**
- `host`: Change `comparateur.local` to your actual domain
- Add TLS configuration for HTTPS

### Docker Images

Update image names in deployment files:
- `backend-deployment.yaml`: Line 26 - Update image name
- `frontend-deployment.yaml`: Line 26 - Update image name

### Storage

For production:
- Uncomment and configure `storageClassName` in `mysql-pvc.yaml`
- Adjust storage size based on your needs

## 🌐 Accessing the Application

### Local Development (Minikube/Kind)

1. **Port Forward (Quick access):**
   ```bash
   kubectl port-forward service/frontend 8080:80 -n comparateur-app
   ```
   Access at: http://localhost:8080

2. **Ingress (Recommended):**
   ```bash
   # Install nginx-ingress controller (if not installed)
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
   
   # Add to /etc/hosts
   echo "$(minikube ip) comparateur.local" | sudo tee -a /etc/hosts
   ```
   Access at: http://comparateur.local

### Cloud Deployment

1. **LoadBalancer Service:**
   ```bash
   # Get external IP
   kubectl get service frontend -n comparateur-app
   ```

2. **Ingress with Domain:**
   - Update `ingress.yaml` with your domain
   - Configure DNS to point to your ingress controller

## 🔍 Monitoring and Troubleshooting

### Useful Commands

```bash
# Check all resources
kubectl get all -n comparateur-app

# View logs
kubectl logs -f deployment/backend -n comparateur-app
kubectl logs -f deployment/frontend -n comparateur-app
kubectl logs -f deployment/mysql -n comparateur-app

# Describe resources for debugging
kubectl describe pod <pod-name> -n comparateur-app
kubectl describe service <service-name> -n comparateur-app

# Execute into containers
kubectl exec -it <pod-name> -n comparateur-app -- /bin/bash
```

### Common Issues

1. **Pods not starting:**
   - Check resource limits and node capacity
   - Verify image availability
   - Check ConfigMaps and Secrets

2. **Database connection issues:**
   - Ensure MySQL pod is running and ready
   - Verify service names and ports
   - Check environment variables

3. **External access issues:**
   - Verify ingress controller is installed
   - Check service types (LoadBalancer vs ClusterIP)
   - Confirm DNS/hosts file configuration

## 🔒 Security Considerations

1. **Secrets Management:**
   - Replace default passwords in `mysql-secret.yaml`
   - Use proper secret management (e.g., Sealed Secrets, External Secrets)

2. **Network Policies:**
   - Implement network policies for additional security
   - Restrict database access to backend only

3. **Resource Limits:**
   - Set appropriate CPU and memory limits
   - Configure resource quotas for the namespace

4. **Image Security:**
   - Use specific image tags instead of `latest`
   - Scan images for vulnerabilities
   - Use private registries for production

## 📈 Scaling

### Manual Scaling

```bash
# Scale backend
kubectl scale deployment backend --replicas=5 -n comparateur-app

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n comparateur-app
```

### Auto-scaling

Create Horizontal Pod Autoscaler:

```bash
# Backend autoscaling
kubectl autoscale deployment backend --cpu-percent=50 --min=2 --max=10 -n comparateur-app

# Frontend autoscaling
kubectl autoscale deployment frontend --cpu-percent=50 --min=2 --max=5 -n comparateur-app
```

## 🧹 Cleanup

To remove all deployed resources:

```bash
# Use the cleanup script
chmod +x cleanup.sh
./cleanup.sh

# Or manually
kubectl delete namespace comparateur-app
```

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Spring Boot on Kubernetes](https://spring.io/guides/gs/spring-boot-kubernetes/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

## 🤝 Contributing

1. Update configurations based on your specific requirements
2. Test deployments in development environment first
3. Document any custom modifications
4. Follow Kubernetes best practices for production deployments
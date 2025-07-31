#!/bin/bash

# BevyFinder Beverage App Deployment Script
# This script helps you deploy your BevyFinder application to various hosting platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  BevyFinder Beverage App Deployment${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "All prerequisites are satisfied!"
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    print_status "Deploying to GitHub Pages..."
    
    # Check if git repository exists
    if [ ! -d ".git" ]; then
        print_status "Initializing git repository..."
        git init
        git add .
        git commit -m "Initial commit - BevyFinder Beverage App"
    fi
    
    # Check if remote exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_warning "No remote repository configured."
        echo "Please create a GitHub repository and run:"
        echo "git remote add origin https://github.com/yourusername/bevyfinder-beverage-app.git"
        echo "Then run this script again."
        return 1
    fi
    
    # Push to GitHub
    print_status "Pushing to GitHub..."
    git add .
    git commit -m "Update BevyFinder Beverage App" || true
    git push origin main || git push origin master
    
    print_status "GitHub Pages deployment initiated!"
    print_status "To enable GitHub Pages:"
    echo "1. Go to your repository on GitHub"
    echo "2. Click Settings → Pages"
    echo "3. Select 'Deploy from a branch'"
    echo "4. Choose 'main' branch and '/ (root)' folder"
    echo "5. Click Save"
    echo ""
    print_status "Your site will be available at: https://yourusername.github.io/bevyfinder-beverage-app"
}

# Function to deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    if command_exists netlify; then
        print_status "Using Netlify CLI..."
        netlify deploy --prod --dir=.
    else
        print_warning "Netlify CLI not installed."
        echo "To deploy to Netlify:"
        echo "1. Go to https://netlify.com"
        echo "2. Drag and drop this folder to the deploy area"
        echo "3. Or install Netlify CLI: npm install -g netlify-cli"
        echo "4. Then run: netlify deploy --prod --dir=."
    fi
}

# Function to deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if command_exists vercel; then
        print_status "Using Vercel CLI..."
        vercel --prod
    else
        print_warning "Vercel CLI not installed."
        echo "To deploy to Vercel:"
        echo "1. Install Vercel CLI: npm install -g vercel"
        echo "2. Run: vercel --prod"
        echo "3. Follow the prompts"
    fi
}

# Function to start local development server
start_local() {
    print_status "Starting local development server..."
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    print_status "Starting server at http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    npm start
}

# Function to build for production
build_production() {
    print_status "Building for production..."
    
    # Create a production-ready build
    if [ ! -d "dist" ]; then
        mkdir dist
    fi
    
    # Copy all files to dist
    cp -r index.html styles.css script.js dist/
    cp -r *.md *.json *.xml *.txt dist/ 2>/dev/null || true
    
    print_status "Production build created in 'dist' folder"
    print_status "You can now deploy the 'dist' folder to any hosting service"
}

# Function to show deployment options
show_menu() {
    print_header
    echo ""
    echo "Choose a deployment option:"
    echo ""
    echo "1) Deploy to GitHub Pages (Free)"
    echo "2) Deploy to Netlify (Free)"
    echo "3) Deploy to Vercel (Free)"
    echo "4) Start local development server"
    echo "5) Build for production"
    echo "6) Show deployment guide"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            check_prerequisites
            deploy_github_pages
            ;;
        2)
            check_prerequisites
            deploy_netlify
            ;;
        3)
            check_prerequisites
            deploy_vercel
            ;;
        4)
            start_local
            ;;
        5)
            build_production
            ;;
        6)
            show_deployment_guide
            ;;
        7)
            print_status "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid choice. Please try again."
            show_menu
            ;;
    esac
}

# Function to show deployment guide
show_deployment_guide() {
    print_header
    echo ""
    echo "DEPLOYMENT GUIDE"
    echo "================"
    echo ""
    echo "Quick Deploy Options:"
    echo "---------------------"
    echo ""
    echo "1. GitHub Pages (Recommended for beginners):"
    echo "   - Free hosting"
    echo "   - Automatic HTTPS"
    echo "   - Custom domain support"
    echo "   - Perfect for static sites"
    echo ""
    echo "2. Netlify (Recommended for performance):"
    echo "   - Free hosting"
    echo "   - Global CDN"
    echo "   - Automatic HTTPS"
    echo "   - Form handling"
    echo "   - Drag & drop deployment"
    echo ""
    echo "3. Vercel (Recommended for developers):"
    echo "   - Free hosting"
    echo "   - Global CDN"
    echo "   - Automatic HTTPS"
    echo "   - Git integration"
    echo "   - Preview deployments"
    echo ""
    echo "4. Firebase Hosting:"
    echo "   - Google's hosting platform"
    echo "   - Free tier available"
    echo "   - Global CDN"
    echo "   - Easy custom domain setup"
    echo ""
    echo "5. AWS S3 + CloudFront:"
    echo "   - Enterprise-grade hosting"
    echo "   - Pay-as-you-go pricing"
    echo "   - Global CDN"
    echo "   - Advanced features"
    echo ""
    echo "For detailed instructions, see deploy.md"
    echo ""
    read -p "Press Enter to return to menu..."
    show_menu
}

# Main execution
main() {
    # Check if script is run with arguments
    if [ $# -gt 0 ]; then
        case $1 in
            "github")
                check_prerequisites
                deploy_github_pages
                ;;
            "netlify")
                check_prerequisites
                deploy_netlify
                ;;
            "vercel")
                check_prerequisites
                deploy_vercel
                ;;
            "local")
                start_local
                ;;
            "build")
                build_production
                ;;
            "guide")
                show_deployment_guide
                ;;
            *)
                echo "Usage: $0 [github|netlify|vercel|local|build|guide]"
                echo "Or run without arguments for interactive menu"
                exit 1
                ;;
        esac
    else
        show_menu
    fi
}

# Run main function with all arguments
main "$@" 
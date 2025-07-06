#!/bin/bash

# Dream Recorder Mobile Integration Test Script
# This script tests the integration between the mobile app and backend

set -e

echo "🧪 Dream Recorder Mobile Integration Test"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:5000"
MOBILE_DIR="DreamRecorderMobile"

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test 1: Check if backend is running
test_backend_running() {
    log_info "Testing backend connectivity..."
    
    if curl -s --max-time 5 "$BACKEND_URL/api/mobile/status" > /dev/null; then
        log_success "Backend is running and accessible"
        return 0
    else
        log_error "Backend is not accessible at $BACKEND_URL"
        return 1
    fi
}

# Test 2: Check API endpoints
test_api_endpoints() {
    log_info "Testing API endpoints..."
    
    # Test status endpoint
    if curl -s "$BACKEND_URL/api/mobile/status" | jq -e '.status' > /dev/null; then
        log_success "Status endpoint working"
    else
        log_error "Status endpoint failed"
        return 1
    fi
    
    # Test dreams endpoint
    if curl -s "$BACKEND_URL/api/mobile/dreams?page=1&limit=5" | jq -e '.dreams' > /dev/null; then
        log_success "Dreams endpoint working"
    else
        log_error "Dreams endpoint failed"
        return 1
    fi
    
    # Test config endpoint
    if curl -s "$BACKEND_URL/api/mobile/config" | jq -e '.audio' > /dev/null; then
        log_success "Config endpoint working"
    else
        log_error "Config endpoint failed"
        return 1
    fi
}

# Test 3: Check mobile app dependencies
test_mobile_dependencies() {
    log_info "Checking mobile app dependencies..."
    
    if [ ! -d "$MOBILE_DIR" ]; then
        log_error "Mobile app directory not found"
        return 1
    fi
    
    cd "$MOBILE_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules not found, installing dependencies..."
        npm install
    fi
    
    # Check TypeScript compilation
    if npx tsc --noEmit; then
        log_success "TypeScript compilation successful"
    else
        log_error "TypeScript compilation failed"
        return 1
    fi
    
    cd ..
}

# Test 4: Check environment configuration
test_environment_config() {
    log_info "Checking environment configuration..."
    
    if [ -f "$MOBILE_DIR/src/config/environment.ts" ]; then
        log_success "Environment configuration file exists"
        
        # Check if development environment is configured
        if grep -q "development" "$MOBILE_DIR/src/config/environment.ts"; then
            log_success "Development environment configured"
        else
            log_warning "Development environment not found"
        fi
    else
        log_error "Environment configuration file missing"
        return 1
    fi
}

# Test 5: Check API service
test_api_service() {
    log_info "Checking API service..."
    
    if [ -f "$MOBILE_DIR/src/services/api.ts" ]; then
        log_success "API service file exists"
        
        # Check if API service has required methods
        if grep -q "getStatus" "$MOBILE_DIR/src/services/api.ts" && \
           grep -q "getDreams" "$MOBILE_DIR/src/services/api.ts" && \
           grep -q "connect" "$MOBILE_DIR/src/services/api.ts"; then
            log_success "API service has required methods"
        else
            log_warning "API service missing some methods"
        fi
    else
        log_error "API service file missing"
        return 1
    fi
}

# Test 6: Check screens
test_screens() {
    log_info "Checking mobile app screens..."
    
    local screens=("HomeScreen" "RecordingScreen" "ProcessingScreen" "PlaybackScreen")
    local missing_screens=()
    
    for screen in "${screens[@]}"; do
        if [ -f "$MOBILE_DIR/src/screens/${screen}.tsx" ]; then
            log_success "$screen exists"
        else
            log_error "$screen missing"
            missing_screens+=("$screen")
        fi
    done
    
    if [ ${#missing_screens[@]} -eq 0 ]; then
        log_success "All screens present"
    else
        log_error "Missing screens: ${missing_screens[*]}"
        return 1
    fi
}

# Test 7: Check navigation
test_navigation() {
    log_info "Checking navigation setup..."
    
    if [ -f "$MOBILE_DIR/src/navigation/AppNavigator.tsx" ]; then
        log_success "Navigation file exists"
        
        # Check if all screens are registered
        local screens=("Home" "Recording" "Processing" "Playback")
        for screen in "${screens[@]}"; do
            if grep -q "$screen" "$MOBILE_DIR/src/navigation/AppNavigator.tsx"; then
                log_success "$screen registered in navigation"
            else
                log_warning "$screen not found in navigation"
            fi
        done
    else
        log_error "Navigation file missing"
        return 1
    fi
}

# Test 8: Check package.json dependencies
test_package_dependencies() {
    log_info "Checking package.json dependencies..."
    
    cd "$MOBILE_DIR"
    
    # Check required dependencies
    local required_deps=(
        "@react-navigation/native"
        "@react-navigation/native-stack"
        "react-native-video"
        "socket.io-client"
        "expo-av"
    )
    
    for dep in "${required_deps[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            log_success "$dep dependency found"
        else
            log_error "$dep dependency missing"
            return 1
        fi
    done
    
    cd ..
}

# Test 9: Check backend mobile endpoints
test_backend_mobile_endpoints() {
    log_info "Checking backend mobile endpoints..."
    
    if [ -f "api_mobile_endpoints.py" ]; then
        log_success "Mobile API endpoints file exists"
        
        # Check if required endpoints are defined
        local endpoints=("/api/mobile/status" "/api/mobile/dreams" "/api/mobile/config")
        for endpoint in "${endpoints[@]}"; do
            if grep -q "$endpoint" api_mobile_endpoints.py; then
                log_success "$endpoint endpoint defined"
            else
                log_warning "$endpoint endpoint not found"
            fi
        done
    else
        log_error "Mobile API endpoints file missing"
        return 1
    fi
}

# Test 10: Check CORS configuration
test_cors_configuration() {
    log_info "Checking CORS configuration..."
    
    if grep -q "flask-cors" requirements.txt; then
        log_success "Flask-CORS dependency found"
    else
        log_error "Flask-CORS dependency missing"
        return 1
    fi
    
    if grep -q "CORS" dream_recorder.py; then
        log_success "CORS configured in main app"
    else
        log_error "CORS not configured in main app"
        return 1
    fi
}

# Main test execution
main() {
    local tests_passed=0
    local tests_failed=0
    
    log_info "Starting integration tests..."
    echo
    
    # Run all tests
    local tests=(
        "test_backend_running"
        "test_api_endpoints"
        "test_mobile_dependencies"
        "test_environment_config"
        "test_api_service"
        "test_screens"
        "test_navigation"
        "test_package_dependencies"
        "test_backend_mobile_endpoints"
        "test_cors_configuration"
    )
    
    for test in "${tests[@]}"; do
        echo "Running $test..."
        if $test; then
            ((tests_passed++))
        else
            ((tests_failed++))
        fi
        echo
    done
    
    # Summary
    echo "=========================================="
    echo "🧪 Integration Test Summary"
    echo "=========================================="
    echo "Tests passed: $tests_passed"
    echo "Tests failed: $tests_failed"
    echo "Total tests: $((tests_passed + tests_failed))"
    echo
    
    if [ $tests_failed -eq 0 ]; then
        log_success "All integration tests passed! 🎉"
        echo
        echo "Next steps:"
        echo "1. Start the backend: docker-compose up -d"
        echo "2. Start the mobile app: cd DreamRecorderMobile && npx react-native run-android"
        echo "3. Test the full user flow"
        exit 0
    else
        log_error "Some integration tests failed! ❌"
        echo
        echo "Please fix the failed tests before proceeding."
        exit 1
    fi
}

# Check if jq is installed for JSON parsing
if ! command -v jq &> /dev/null; then
    log_warning "jq is not installed. Installing..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y jq
    elif command -v yum &> /dev/null; then
        sudo yum install -y jq
    elif command -v brew &> /dev/null; then
        brew install jq
    else
        log_error "Could not install jq. Please install it manually."
        exit 1
    fi
fi

# Run main function
main "$@" 
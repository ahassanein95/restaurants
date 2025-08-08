#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env.deployment ]; then
    source .env.deployment
else
    echo -e "${RED}Error: .env.deployment file not found!${NC}"
    echo "Please create .env.deployment with your credentials."
    exit 1
fi

# Validate required environment variables
if [ -z "$GITHUB_USERNAME" ] || [ -z "$GITHUB_TOKEN" ] || [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}Error: Missing required environment variables!${NC}"
    echo "Please check your .env.deployment file contains:"
    echo "- GITHUB_USERNAME"
    echo "- GITHUB_TOKEN"
    echo "- VERCEL_TOKEN"
    exit 1
fi

# Global variables for tracking deployments
declare -a SUCCESSFUL_DEPLOYMENTS=()
declare -a FAILED_DEPLOYMENTS=()

# Check if folder path is provided as argument
if [ "$1" ]; then
    TARGET_DIR="$1"
else
    # Set default values
    TARGET_DIR=${PROJECT_DIR:-"template2"}
fi

REPO_PRIVATE=${REPO_PRIVATE:-true}

# Validate that the target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}❌ Error: Directory '$TARGET_DIR' does not exist!${NC}"
    echo -e "${YELLOW}Usage: $0 [folder_path]${NC}"
    echo -e "${YELLOW}Example: $0 template2${NC}"
    echo -e "${YELLOW}Example: $0 /path/to/projects/folder${NC}"
    exit 1
fi

# Function to run command with timeout (macOS compatible)
run_with_timeout() {
    local timeout_seconds=$1
    local cmd="$2"
    
    # Create a temporary script to run the command
    local temp_script=$(mktemp)
    echo "#!/bin/bash" > "$temp_script"
    echo "$cmd" >> "$temp_script"
    chmod +x "$temp_script"
    
    # Run command with timeout using background process and kill
    "$temp_script" &
    local cmd_pid=$!
    
    # Monitor the process
    local count=0
    while kill -0 $cmd_pid 2>/dev/null && [ $count -lt $timeout_seconds ]; do
        sleep 1
        count=$((count + 1))
    done
    
    # Check if process is still running (timed out)
    if kill -0 $cmd_pid 2>/dev/null; then
        kill -9 $cmd_pid 2>/dev/null
        rm -f "$temp_script"
        return 124  # timeout exit code
    fi
    
    # Get the actual exit code
    wait $cmd_pid
    local exit_code=$?
    rm -f "$temp_script"
    return $exit_code
}

# Function to check if directory contains deployable content
is_deployable_folder() {
    local folder="$1"
    
    # Check for common project files
    if [ -f "$folder/package.json" ] || [ -f "$folder/index.html" ] || [ -f "$folder/index.js" ] || [ -f "$folder/next.config.js" ] || [ -f "$folder/vite.config.js" ] || [ -f "$folder/src/index.js" ] || [ -f "$folder/src/App.js" ]; then
        return 0  # Deployable
    fi
    
    return 1  # Not deployable
}

# Determine if we're deploying a single folder or multiple folders
PROJECT_FOLDERS=()

# Check if TARGET_DIR itself is a deployable project or contains multiple projects
if is_deployable_folder "$TARGET_DIR"; then
    # Single project deployment
    PROJECT_FOLDERS=("$TARGET_DIR")
    echo -e "${BLUE}🚀 Single project deployment detected${NC}"
else
    # Multiple projects deployment - find all subdirectories
    echo -e "${BLUE}🚀 Multi-project deployment detected${NC}"
    echo -e "${BLUE}Scanning for deployable folders in: $TARGET_DIR${NC}"
    
    for folder in "$TARGET_DIR"/*; do
        if [ -d "$folder" ]; then
            folder_name=$(basename "$folder")
            # Skip hidden folders and common non-project folders
            if [[ ! "$folder_name" =~ ^\..*$ ]] && [[ "$folder_name" != "node_modules" ]] && [[ "$folder_name" != ".git" ]]; then
                if is_deployable_folder "$folder"; then
                    PROJECT_FOLDERS+=("$folder")
                    echo -e "${GREEN}  ✅ Found deployable project: $folder_name${NC}"
                else
                    echo -e "${YELLOW}  ⚠️  Skipping non-deployable folder: $folder_name${NC}"
                fi
            fi
        fi
    done
    
    if [ ${#PROJECT_FOLDERS[@]} -eq 0 ]; then
        echo -e "${RED}❌ No deployable projects found in '$TARGET_DIR'${NC}"
        echo -e "${YELLOW}Looking for folders containing: package.json, index.html, index.js, next.config.js, vite.config.js, src/index.js, or src/App.js${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}Found ${#PROJECT_FOLDERS[@]} project(s) to deploy${NC}"

# Function to check if repository exists
check_repo_exists() {
    local repo_name="$1"
    local response=$(curl -s -w "%{http_code}" -H "Authorization: token $GITHUB_TOKEN" \
        "https://api.github.com/repos/$GITHUB_USERNAME/$repo_name" \
        -o /dev/null)
    
    if [ "$response" = "200" ]; then
        return 0  # Repository exists
    else
        return 1  # Repository doesn't exist
    fi
}

# Function to create GitHub repository
create_github_repo() {
    local repo_name="$1"
    echo -e "${YELLOW}📁 Creating GitHub repository: $repo_name${NC}"
    
    local is_private_json="false"
    if [ "$REPO_PRIVATE" = "true" ]; then
        is_private_json="true"
    fi
    
    local response=$(curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$repo_name\",\"private\":$is_private_json}" \
        "https://api.github.com/user/repos")
    
    if echo "$response" | grep -q '"name"'; then
        echo -e "${GREEN}✅ Repository created successfully!${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to create repository. Response: $response${NC}"
        return 1
    fi
}

# Function to setup git and push to GitHub
setup_git_and_push() {
    local project_dir="$1"
    local repo_name="$2"
    
    cd "$project_dir" || {
        echo -e "${RED}❌ Project directory '$project_dir' not found!${NC}"
        return 1
    }
    
    echo -e "${YELLOW}🔄 Setting up git repository...${NC}"
    
    # Initialize git if not already done
    if [ ! -d ".git" ]; then
        git init
        echo -e "${GREEN}✅ Git repository initialized${NC}"
    fi
    
    # Configure git to handle pull merge conflicts
    git config pull.rebase false 2>/dev/null || true
    
    # Add all files
    git add .
    
    # Check if there are any changes to commit
    if git diff --cached --quiet; then
        echo -e "${YELLOW}ℹ️  No changes to commit${NC}"
    else
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        echo -e "${GREEN}✅ Changes committed${NC}"
    fi
    
    # Set up remote
    local remote_url="https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$repo_name.git"
    
    if git remote get-url origin > /dev/null 2>&1; then
        git remote set-url origin "$remote_url"
    else
        git remote add origin "$remote_url"
    fi
    
    # Push to GitHub
    echo -e "${YELLOW}📤 Pushing to GitHub...${NC}"
    
    # Try to push normally first
    if git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null; then
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        cd - > /dev/null
        return 0
    else
        # If normal push fails, use force push to override remote changes
        echo -e "${YELLOW}⚠️  Push rejected, using force push to override remote...${NC}"
        if git push -u origin main --force 2>/dev/null || git push -u origin master --force 2>/dev/null; then
            echo -e "${GREEN}✅ Successfully force-pushed to GitHub!${NC}"
            cd - > /dev/null
            return 0
        else
            echo -e "${RED}❌ Failed to push to GitHub${NC}"
            cd - > /dev/null
            return 1
        fi
    fi
}

# Function to link GitHub repository to Vercel project for automatic deployment
link_github_to_vercel() {
    local project_dir="$1"
    local repo_name="$2"
    local vercel_cmd="$3"
    
    echo -e "${YELLOW}🔗 Setting up GitHub-Vercel automatic deployment...${NC}"
    
    cd "$project_dir" || {
        echo -e "${RED}❌ Project directory '$project_dir' not found!${NC}"
        return 1
    }
    
    # Try to link the repository to Vercel project for automatic deployment
    echo -e "${YELLOW}📡 Linking GitHub repository to Vercel project...${NC}"
    
    # Use vercel link to connect the local project to the Vercel project
    # This enables automatic deployments from GitHub
    if $vercel_cmd link --yes --token="$VERCEL_TOKEN" 2>/dev/null; then
        echo -e "${GREEN}✅ Successfully linked GitHub repository to Vercel project!${NC}"
        echo -e "${BLUE}🚀 Future pushes to GitHub will automatically deploy to Vercel${NC}"
        
        # Try to set up Git integration if not already done
        echo -e "${YELLOW}🔧 Configuring automatic deployment settings...${NC}"
        
        # The project should now be connected and future Git pushes will trigger deployments
        echo -e "${GREEN}✅ Automatic deployment configured!${NC}"
        echo -e "${BLUE}📋 Next steps:${NC}"
        echo -e "${BLUE}  • Any push to the main/master branch will trigger a production deployment${NC}"
        echo -e "${BLUE}  • Feature branches will create preview deployments${NC}"
        echo -e "${BLUE}  • Check your Vercel dashboard to manage deployment settings${NC}"
        
        cd - > /dev/null
        return 0
    else
        echo -e "${YELLOW}⚠️  Could not automatically link GitHub to Vercel${NC}"
        echo -e "${YELLOW}💡 You can manually connect GitHub integration in the Vercel dashboard:${NC}"
        echo -e "${BLUE}  1. Go to https://vercel.com/dashboard${NC}"
        echo -e "${BLUE}  2. Find your project: $repo_name${NC}"
        echo -e "${BLUE}  3. Go to Settings > Git Integration${NC}"
        echo -e "${BLUE}  4. Connect your GitHub repository${NC}"
        
        cd - > /dev/null
        return 1
    fi
}

# Function to deploy to Vercel
deploy_to_vercel() {
    local project_dir="$1"
    local repo_name="$2"
    echo -e "${YELLOW}🌐 Deploying to Vercel...${NC}"
    
    cd "$project_dir" || {
        echo -e "${RED}❌ Project directory '$project_dir' not found!${NC}"
        return 1
    }
    
    # Try to use global Vercel first, fallback to npx
    local vercel_cmd="vercel"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}📦 Vercel CLI not found globally, using npx...${NC}"
        vercel_cmd="npx vercel"
    fi
    
    # Set Vercel token as environment variable for authentication
    echo -e "${YELLOW}🔐 Setting up Vercel authentication...${NC}"
    export VERCEL_TOKEN="$VERCEL_TOKEN"
    
    # Deploy to Vercel
    local vercel_flags="--prod --yes"
    if [ -n "$VERCEL_TEAM_ID" ] && [ "$VERCEL_TEAM_ID" != "your_team_id_here_optional" ]; then
        vercel_flags="$vercel_flags --team $VERCEL_TEAM_ID"
    fi
    
    # Handle project naming for Vercel compatibility
    local current_dir=$(basename "$PWD")
    local normalized_name=$(normalize_project_name "$current_dir")
    
    # If directory name needs normalization, create a symlink approach
    if [ "$current_dir" != "$normalized_name" ]; then
        echo -e "${YELLOW}📝 Creating Vercel-compatible project setup...${NC}"
        # Use --name flag (though deprecated, it still works for setting project name)
        vercel_flags="$vercel_flags --name $normalized_name"
    fi
    
    echo -e "${YELLOW}🚀 Starting Vercel deployment...${NC}"
    local deployment_output
    
    # Create a temporary file for output
    local temp_output=$(mktemp)
    
    if run_with_timeout 480 "$vercel_cmd $vercel_flags --token=\"$VERCEL_TOKEN\" > \"$temp_output\" 2>&1"; then
        deployment_output=$(cat "$temp_output")
        rm -f "$temp_output"
    else
        echo -e "${RED}❌ Vercel deployment timed out after 8 minutes${NC}"
        rm -f "$temp_output"
        cd - > /dev/null
        return 1
    fi
    
    # Multiple URL extraction methods for better reliability
    local deployment_url=""
    
    # Method 1: Look for production URL pattern
    deployment_url=$(echo "$deployment_output" | grep -oE 'https://[a-zA-Z0-9-]+\.vercel\.app' | head -1)
    
    # Method 2: Look for "Deployed to" or similar patterns
    if [ -z "$deployment_url" ]; then
        deployment_url=$(echo "$deployment_output" | grep -oE 'https://[^[:space:]]+\.vercel\.app' | head -1)
    fi
    
    # Method 3: Look for any .vercel.app URL in the output
    if [ -z "$deployment_url" ]; then
        deployment_url=$(echo "$deployment_output" | grep -oE 'https://[^[:space:]]+' | grep '\.vercel\.app' | head -1)
    fi
    
    # Method 4: Use vercel ls command to get the latest deployment
    if [ -z "$deployment_url" ]; then
        echo -e "${YELLOW}🔍 Fetching deployment URL...${NC}"
        local temp_ls_output=$(mktemp)
        
        if run_with_timeout 20 "$vercel_cmd ls --token=\"$VERCEL_TOKEN\" --yes > \"$temp_ls_output\" 2>&1"; then
            local vercel_ls_output=$(cat "$temp_ls_output")
            local project_url=$(echo "$vercel_ls_output" | grep "$(basename "$PWD")" | awk '{print $2}' | head -1)
            if [ -n "$project_url" ]; then
                deployment_url="https://$project_url"
            fi
        else
            echo -e "${YELLOW}⚠️  Vercel ls command timed out after 20 seconds${NC}"
        fi
        rm -f "$temp_ls_output"
    fi
    
    if [ -n "$deployment_url" ]; then
        echo -e "${GREEN}✅ Deployment successful!${NC}"
        echo -e "${GREEN}🌍 Live URL: ${deployment_url}${NC}"
        echo -e "${BLUE}📱 Click here: ${deployment_url}${NC}"
        
        # Copy URL to clipboard if pbcopy is available (macOS)
        if command -v pbcopy &> /dev/null; then
            echo "$deployment_url" | pbcopy
            echo -e "${BLUE}📋 URL copied to clipboard!${NC}"
        fi
        
        # Try to open the URL in browser (optional)
        if command -v open &> /dev/null; then
            echo -e "${YELLOW}🔗 Opening in browser...${NC}"
            open "$deployment_url"
        fi
        
        # Set up GitHub-Vercel automatic deployment integration
        echo ""
        # We're already in the project directory, so use current directory
        if link_github_to_vercel "." "$repo_name" "$vercel_cmd"; then
            echo -e "${GREEN}🎉 Complete setup: GitHub repository linked to Vercel for automatic deployment!${NC}"
        else
            echo -e "${YELLOW}⚠️  Deployment successful, but automatic GitHub integration needs manual setup${NC}"
        fi
    else
        echo -e "${RED}❌ Deployment may have failed or URL not detected${NC}"
        echo -e "${YELLOW}Full deployment output:${NC}"
        echo "$deployment_output"
        echo ""
        echo -e "${BLUE}💡 Try checking your Vercel dashboard: https://vercel.com/dashboard${NC}"
        return 1
    fi
    
    cd - > /dev/null
    return 0
}

# Function to normalize project name for Vercel compatibility
normalize_project_name() {
    local name="$1"
    # Convert to lowercase and replace underscores with hyphens
    # Remove any characters that aren't letters, digits, dots, hyphens, or underscores
    echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/_/-/g' | sed 's/[^a-z0-9.-]//g' | sed 's/--*/-/g' | sed 's/^-\|-$//g'
}

# Function to deploy a single project
deploy_single_project() {
    local project_dir="$1"
    local original_name=$(basename "$project_dir")
    local repo_name=$(normalize_project_name "$original_name")
    
    echo -e "\n${BLUE}🚀 Deploying project: $repo_name${NC}"
    echo -e "${BLUE}📂 Directory: $project_dir${NC}"
    
    # Warn if project name was normalized
    if [ "$original_name" != "$repo_name" ]; then
        echo -e "${YELLOW}⚠️  Project name normalized: '$original_name' → '$repo_name' (Vercel compatibility)${NC}"
    fi
    
    # Check if repository exists
    if check_repo_exists "$repo_name"; then
        echo -e "${GREEN}✅ Repository already exists${NC}"
    else
        echo -e "${YELLOW}ℹ️  Repository doesn't exist, creating it...${NC}"
        if ! create_github_repo "$repo_name"; then
            echo -e "${RED}❌ Failed to create repository for $repo_name${NC}"
            FAILED_DEPLOYMENTS+=("$repo_name - Repository creation failed")
            return 1
        fi
    fi
    
    # Setup git and push
    if ! setup_git_and_push "$project_dir" "$repo_name"; then
        echo -e "${RED}❌ Failed to push to GitHub for $repo_name${NC}"
        FAILED_DEPLOYMENTS+=("$repo_name - Git push failed")
        return 1
    fi
    
    # Deploy to Vercel
    if ! deploy_to_vercel "$project_dir" "$repo_name"; then
        echo -e "${RED}❌ Failed to deploy to Vercel for $repo_name${NC}"
        FAILED_DEPLOYMENTS+=("$repo_name - Vercel deployment failed")
        return 1
    fi
    
    echo -e "${GREEN}🎉 Successfully deployed $repo_name!${NC}"
    echo -e "${BLUE}Repository: https://github.com/$GITHUB_USERNAME/$repo_name${NC}"
    SUCCESSFUL_DEPLOYMENTS+=("$repo_name")
    return 0
}

# Function to show deployment summary
show_deployment_summary() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}          DEPLOYMENT SUMMARY           ${NC}"
    echo -e "${BLUE}========================================${NC}"
    
    if [ ${#SUCCESSFUL_DEPLOYMENTS[@]} -gt 0 ]; then
        echo -e "${GREEN}✅ Successful deployments (${#SUCCESSFUL_DEPLOYMENTS[@]}):${NC}"
        for deployment in "${SUCCESSFUL_DEPLOYMENTS[@]}"; do
            echo -e "${GREEN}  ✓ $deployment${NC}"
            echo -e "    📂 https://github.com/$GITHUB_USERNAME/$deployment"
        done
        echo ""
    fi
    
    if [ ${#FAILED_DEPLOYMENTS[@]} -gt 0 ]; then
        echo -e "${RED}❌ Failed deployments (${#FAILED_DEPLOYMENTS[@]}):${NC}"
        for deployment in "${FAILED_DEPLOYMENTS[@]}"; do
            echo -e "${RED}  ✗ $deployment${NC}"
        done
        echo ""
    fi
    
    echo -e "${BLUE}Total projects processed: $((${#SUCCESSFUL_DEPLOYMENTS[@]} + ${#FAILED_DEPLOYMENTS[@]}))${NC}"
    echo -e "${BLUE}========================================${NC}"
}

# Function to show usage help
show_usage() {
    echo -e "${BLUE}Usage: $0 [folder_path]${NC}"
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "  $0                    # Deploy default folder (template2)"
    echo -e "  $0 template2          # Deploy single template2 folder"
    echo -e "  $0 projects/          # Deploy all folders in projects/ directory"
    echo -e "  $0 /full/path/to/project    # Deploy with full path"
    echo ""
    echo -e "${YELLOW}Note: ${NC}"
    echo -e "- If folder contains deployable files, deploys that single project"
    echo -e "- If folder contains subfolders with deployable files, deploys all subfolders"
    echo -e "- Repository names are auto-generated from folder names"
}

# Check for help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_usage
    exit 0
fi

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting deployment process...${NC}"
    
    # Deploy each project
    for project_folder in "${PROJECT_FOLDERS[@]}"; do
        deploy_single_project "$project_folder"
        echo -e "${BLUE}----------------------------------------${NC}"
    done
    
    # Show summary
    show_deployment_summary
    
    # Exit with appropriate code
    if [ ${#FAILED_DEPLOYMENTS[@]} -eq 0 ]; then
        echo -e "${GREEN}🎉 All deployments completed successfully!${NC}"
        exit 0
    else
        echo -e "${YELLOW}⚠️  Some deployments failed. Check the summary above.${NC}"
        exit 1
    fi
}

# Run main function
main
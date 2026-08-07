#!/usr/bin/env bash
set -e

# Ensure Bun is installed
if ! command -v bun &> /dev/null; then
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Export PATH for subsequent commands in script
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

echo "Installing project dependencies via Bun..."
bun install

echo "Creating .env with mock configuration..."
cat << 'EOF' > .env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8000/api/v1
EOF

echo "========================================================="
echo "Codespace setup complete!"
echo "Dev server will start on port 3000 in mock mode."
echo "Check the Ports panel in VS Code / Codespaces to view the app."
echo "If sharing externally, change Port 3000 Visibility to Public."
echo "========================================================="

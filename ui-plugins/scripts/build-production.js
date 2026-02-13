#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, cwd) {
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error executing: ${command}`, 'red');
    return false;
  }
}

// Get environment URLs from process.env or use defaults
const COMPONENTS_URL = process.env.COMPONENTS_URL || 'https://components.yourdomain.com';
const AUTH_URL = process.env.AUTH_URL || 'https://auth.yourdomain.com';
const PLATFORM_URL = process.env.PLATFORM_URL || 'https://platform.yourdomain.com';

log('\n🚀 Building Microfrontends for Production\n', 'blue');
log(`Components URL: ${COMPONENTS_URL}`, 'yellow');
log(`Auth URL: ${AUTH_URL}`, 'yellow');
log(`Platform URL: ${PLATFORM_URL}`, 'yellow');
log('\n');

const rootDir = __dirname.replace('/scripts', '').replace('\\scripts', '');
const componentsDir = path.join(rootDir, 'components');
const authDir = path.join(rootDir, 'auth');
const platformDir = path.join(rootDir, 'platform');

// Build order matters! Remotes first, then host
const builds = [
  {
    name: 'Components',
    dir: componentsDir,
    env: { PUBLIC_PATH: `${COMPONENTS_URL}/` }
  },
  {
    name: 'Auth',
    dir: authDir,
    env: { PUBLIC_PATH: `${AUTH_URL}/` }
  },
  {
    name: 'Platform',
    dir: platformDir,
    env: {
      COMPONENTS_URL,
      AUTH_URL,
      PUBLIC_PATH: `${PLATFORM_URL}/`
    }
  }
];

let success = true;

for (const build of builds) {
  log(`\n📦 Building ${build.name}...`, 'blue');
  
  const envString = Object.entries(build.env)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ');
  
  const command = process.platform === 'win32'
    ? `set ${envString.replace(/ /g, ' && set ')} && npm run build`
    : `${envString} npm run build`;
  
  const result = execCommand(command, build.dir);
  
  if (result) {
    log(`✓ ${build.name} built successfully`, 'green');
  } else {
    log(`✗ ${build.name} build failed`, 'red');
    success = false;
    break;
  }
}

if (success) {
  log('\n✨ All microfrontends built successfully!', 'green');
  log('\nNext steps:', 'blue');
  log('1. Deploy components/dist to ' + COMPONENTS_URL);
  log('2. Deploy auth/dist to ' + AUTH_URL);
  log('3. Deploy platform/dist to ' + PLATFORM_URL);
  log('\nOr test locally with: npm run serve:all\n');
} else {
  log('\n❌ Build failed. Please fix errors and try again.\n', 'red');
  process.exit(1);
}

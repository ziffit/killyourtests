import { execSync } from 'child_process';

function getAvailableDockerContexts(): string[] {
  try {
    const output = execSync('docker context ls --format "{{.Name}}"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return output
      .split('\n')
      .map((line: string) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function restartJuiceShopContainer() {
  const contexts = getAvailableDockerContexts();
  const hasDesktopLinuxContext = contexts.includes('desktop-linux');
  const commands: string[] = [];

  // Prefer Docker Desktop Linux engine when available (common on macOS/Windows).
  if ((process.platform === 'darwin' || process.platform === 'win32') && hasDesktopLinuxContext) {
    commands.push('docker --context desktop-linux compose restart juice-shop');
  }

  // Default command for Linux and as fallback on all platforms.
  commands.push('docker compose restart juice-shop');

  const errors: string[] = [];
  for (const cmd of commands) {
    try {
      console.log(`Trying: ${cmd}`);
      execSync(cmd, { stdio: 'inherit' });
      return;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(`Failed to restart Juice Shop container. Tried commands: ${commands.join(' | ')}. Errors: ${errors.join(' | ')}`);
}

async function globalSetup() {
  console.log('\nResetting OWASP Juice Shop database via Docker restart...');
  try {
    // Restart the container to clear in-memory SQLite database and upload directories
    restartJuiceShopContainer();
    
    // Give Juice Shop a couple of seconds to boot up and be ready
    console.log('Waiting for Juice Shop to be ready...');
    let ready = false;
    for (let i = 0; i < 15; i++) {
      try {
        const response = await fetch('http://localhost:3000');
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {
        // Ignored, service not ready yet
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (!ready) {
      throw new Error('Juice Shop did not start in time.');
    }
    console.log('Juice Shop is ready. Starting tests...\n');
  } catch (error) {
    console.error('Failed to reset Juice Shop:', error);
    process.exit(1);
  }
}

export default globalSetup;

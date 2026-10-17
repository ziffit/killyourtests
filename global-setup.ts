import { execSync } from 'child_process';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000';

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
  // Prefer Docker Desktop Linux engine when available (common on macOS/Windows).
  const useDesktopLinux =
    (process.platform === 'darwin' || process.platform === 'win32') && contexts.includes('desktop-linux');
  const docker = useDesktopLinux ? 'docker --context desktop-linux' : 'docker';

  // `compose restart` exits 0 as a silent no-op when the container is missing.
  // Check first: fresh clone -> create via "up -d", otherwise restart (DB reset).
  const containerId = execSync(`${docker} compose ps -q juice-shop`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
  const primary = containerId ? 'compose restart juice-shop' : 'compose up -d juice-shop';
  const commands: string[] = [];

  if (useDesktopLinux) {
    commands.push(`${docker} ${primary}`);
  }
  commands.push(`${docker} ${primary}`, `${docker} compose up -d juice-shop`);

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

  throw new Error(
    `Juice-Shop-Container konnte nicht gestartet werden. Versucht: ${commands.join(' | ')}. ` +
      `Fehler: ${errors.join(' | ')}. Ist Docker gestartet ("docker info") und Compose v2 installiert?`,
  );
}

async function globalSetup() {
  console.log(`\nResetting OWASP Juice Shop database at ${baseUrl} via Docker restart...`);
  const maxWaitSeconds = 60;
  try {
    restartJuiceShopContainer();

    console.log('Waiting for Juice Shop to be ready...');
    let ready = false;
    for (let i = 0; i < maxWaitSeconds; i++) {
      try {
        const response = await fetch(baseUrl);
        if (response.ok) {
          ready = true;
          break;
        }
      } catch {
        // Ignored, service not ready yet
      }
      if (i % 10 === 9) {
        console.log(`Still waiting (${i + 1}s)...`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    if (!ready) {
      throw new Error(`Juice Shop did not start within ${maxWaitSeconds}s at ${baseUrl}.`);
    }
    console.log('Juice Shop is ready. Starting tests...\n');
  } catch (error) {
    console.error('Failed to reset Juice Shop:', error);
    process.exit(1);
  }
}

export default globalSetup;

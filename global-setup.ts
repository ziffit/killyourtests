import { execSync } from 'child_process';

async function globalSetup() {
  console.log('\nResetting OWASP Juice Shop database via Docker restart...');
  try {
    // Restart the container to clear in-memory SQLite database and upload directories
    execSync('docker compose restart juice-shop', { stdio: 'inherit' });
    
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
      } catch (e) {
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

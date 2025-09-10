/**
 * API Test Runner - Run only API-related tests
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Running API Tests...\n');

try {
    // Run only API-related tests
    const testPattern = 'tests/unit/(controllers|routes|api)/**/*.test.js';
    
    console.log(`📋 Test Pattern: ${testPattern}\n`);
    
    const command = `npx jest "${testPattern}" --verbose --coverage --testTimeout=10000`;
    
    console.log(`🔧 Command: ${command}\n`);
    
    execSync(command, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
    });
    
    console.log('\n✅ API Tests completed successfully!');
    
} catch (error) {
    console.error('\n❌ API Tests failed:');
    console.error(error.message);
    process.exit(1);
}

const fs = require('fs');
const path = require('path');

// Auto-backup script to run before any risky operations
function createAutoBackup() {
  const date = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = './backups';
  const sourceDb = './prisma/dev.db';
  const backupFile = `${backupDir}/auto_backup_${date}.db`;
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Create backup
  if (fs.existsSync(sourceDb)) {
    fs.copyFileSync(sourceDb, backupFile);
    console.log(`🔒 Auto-backup created: ${backupFile}`);
    return backupFile;
  } else {
    console.log('⚠️  Source database not found');
    return null;
  }
}

// Add this to package.json scripts
const packageJsonPath = './package.json';
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts['backup']) {
    packageJson.scripts['backup'] = './scripts/backup-db.sh';
    packageJson.scripts['db:backup'] = 'node scripts/auto-backup.js';
    packageJson.scripts['db:reset-safe'] = 'npm run backup && npx prisma migrate reset';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Added backup scripts to package.json');
  }
}

if (require.main === module) {
  createAutoBackup();
}

module.exports = { createAutoBackup };

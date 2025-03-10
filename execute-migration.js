/**
 * Execute Migration Script
 * 
 * This script executes the migration plan generated by migration-helper.js.
 * It copies files from the old structure to the new one and creates necessary directories.
 */

const fs = require('fs');
const path = require('path');

// Load the migration plan
const migrationPlan = JSON.parse(fs.readFileSync('migration-plan.json', 'utf8'));

// Function to ensure directory exists
function ensureDirectoryExists(dirPath) {
  const dirname = path.dirname(dirPath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

// Function to copy a file
function copyFile(source, destination) {
  ensureDirectoryExists(destination);
  fs.copyFileSync(source, destination);
}

// Main function
function executeMigration() {
  console.log('Executing migration plan...\n');
  
  // Create a list of directories to create
  const directories = new Set();
  
  migrationPlan.forEach(item => {
    const dir = path.dirname(item.newPath);
    directories.add(dir);
  });
  
  // Create directories
  console.log('Creating directories...');
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
  
  // Copy files
  console.log('\nCopying files...');
  migrationPlan.forEach((item, index) => {
    try {
      copyFile(item.oldPath, item.newPath);
      console.log(`${index + 1}/${migrationPlan.length}: Copied ${item.fileName} to ${item.newPath}`);
    } catch (error) {
      console.error(`Error copying ${item.fileName}: ${error.message}`);
    }
  });
  
  console.log('\nMigration complete!');
}

// Run the main function
executeMigration(); 
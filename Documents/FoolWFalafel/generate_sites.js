#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const RESTAURANT_DATA_DIR = './restaurant_data';
const TEMPLATES_DIR = './templates';
const GENERATED_SITES_DIR = './generated_sites';

function sanitizeName(name) {
  return name
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/_+/g, '_')
    .trim();
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        continue;
      }
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function getRandomTemplate() {
  const templates = fs.readdirSync(TEMPLATES_DIR)
    .filter(item => fs.statSync(path.join(TEMPLATES_DIR, item)).isDirectory());
  
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

function replaceRestaurantData(templateDir, restaurantData) {
  const dataFilePath = path.join(templateDir, 'src', 'data', 'restaurant.json');
  
  if (fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify(restaurantData, null, 2));
  } else {
    console.warn(`⚠️  Restaurant data file not found at: ${dataFilePath}`);
  }
}

function generateSites() {
  console.log('🚀 Starting restaurant site generation...\n');

  if (!fs.existsSync(GENERATED_SITES_DIR)) {
    fs.mkdirSync(GENERATED_SITES_DIR, { recursive: true });
  }

  const restaurantFiles = fs.readdirSync(RESTAURANT_DATA_DIR)
    .filter(file => file.endsWith('.json'));

  if (restaurantFiles.length === 0) {
    console.log('❌ No restaurant JSON files found in restaurant_data/');
    return;
  }

  console.log(`📂 Found ${restaurantFiles.length} restaurant files`);
  console.log(`📂 Available templates: ${fs.readdirSync(TEMPLATES_DIR).filter(item => 
    fs.statSync(path.join(TEMPLATES_DIR, item)).isDirectory()).join(', ')}\n`);

  for (const restaurantFile of restaurantFiles) {
    try {
      const restaurantFilePath = path.join(RESTAURANT_DATA_DIR, restaurantFile);
      const restaurantData = JSON.parse(fs.readFileSync(restaurantFilePath, 'utf8'));

      if (!restaurantData.name) {
        console.log(`⚠️  Skipping ${restaurantFile}: No 'name' field found`);
        continue;
      }

      const sanitizedName = sanitizeName(restaurantData.name);
      const selectedTemplate = getRandomTemplate();
      const templatePath = path.join(TEMPLATES_DIR, selectedTemplate);
      const outputPath = path.join(GENERATED_SITES_DIR, sanitizedName);

      console.log(`🏗️  Processing: ${restaurantData.name}`);
      console.log(`   📋 Template: ${selectedTemplate}`);
      console.log(`   📁 Output: generated_sites/${sanitizedName}/`);

      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
      }

      copyDirectory(templatePath, outputPath);

      replaceRestaurantData(outputPath, restaurantData);

      console.log(`   ✅ Site generated successfully!\n`);

    } catch (error) {
      console.error(`❌ Error processing ${restaurantFile}:`, error.message);
    }
  }

  console.log('🎉 Site generation completed!');
  console.log(`📊 Generated sites are located in: ${GENERATED_SITES_DIR}/`);
}

if (require.main === module) {
  generateSites();
}

module.exports = { generateSites };
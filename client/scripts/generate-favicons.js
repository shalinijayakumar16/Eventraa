/**
 * Favicon Generator Script
 * Generates PNG and ICO favicon files from SVG source
 * 
 * Install required packages:
 * npm install sharp svg-to-png
 * 
 * Run this script from the client directory:
 * node scripts/generate-favicons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { svg2png } = require('svg-to-png');

const publicDir = path.join(__dirname, '../public');
const svgPath = path.join(publicDir, 'eventra-favicon.svg');

async function generateFavicons() {
  try {
    console.log('🎨 Generating favicon files from SVG...\n');

    // Generate 32x32 PNG
    console.log('📦 Generating eventra-favicon-32.png...');
    await sharp(svgPath)
      .png()
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(publicDir, 'eventra-favicon-32.png'));
    console.log('✅ eventra-favicon-32.png created\n');

    // Generate 64x64 PNG
    console.log('📦 Generating eventra-favicon-64.png...');
    await sharp(svgPath)
      .png()
      .resize(64, 64, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(publicDir, 'eventra-favicon-64.png'));
    console.log('✅ eventra-favicon-64.png created\n');

    // Generate 256x256 for build
    console.log('📦 Generating eventra-favicon-256.png (for build)...');
    await sharp(svgPath)
      .png()
      .resize(256, 256, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(publicDir, 'eventra-favicon-256.png'));
    console.log('✅ eventra-favicon-256.png created\n');

    // Generate ICO from 256x256 PNG
    console.log('📦 Generating eventra-favicon.ico...');
    const icoGenerator = require('all-icon-wizard');
    await icoGenerator({
      input: path.join(publicDir, 'eventra-favicon-256.png'),
      output: path.join(publicDir, 'eventra-favicon.ico'),
      width: 256,
      height: 256
    });
    console.log('✅ eventra-favicon.ico created\n');

    console.log('🎉 All favicon files generated successfully!');
    console.log('\n📋 Generated files:');
    console.log('  - eventra-favicon.svg (vector, already present)');
    console.log('  - eventra-favicon-32.png (32x32)');
    console.log('  - eventra-favicon-64.png (64x64)');
    console.log('  - eventra-favicon-256.png (high quality)');
    console.log('  - eventra-favicon.ico (Windows favicon)');

  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

// Check dependencies
function checkDependencies() {
  try {
    require('sharp');
    require('svg-to-png');
    return true;
  } catch (e) {
    console.log('⚠️  Required packages not found.');
    console.log('Please run: npm install sharp svg-to-png all-icon-wizard');
    return false;
  }
}

if (checkDependencies()) {
  generateFavicons();
}

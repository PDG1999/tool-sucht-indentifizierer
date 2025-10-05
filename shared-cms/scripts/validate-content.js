#!/usr/bin/env node

import { ContentLoader, WhiteLabelManager } from '../dist/content-engine/index.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 SAMEBI CMS Content Validation');
console.log('================================');

// Validate all content files
console.log('\n📄 Validating Content Files...');
const contentValidation = ContentLoader.validateAllContent();

if (contentValidation.valid) {
  console.log('✅ All content files are valid');
} else {
  console.log('❌ Content validation errors found:');
  contentValidation.errors.forEach(error => {
    console.log(`   - ${error}`);
  });
}

// Validate all white-label configs
console.log('\n🏷️  Validating White-Label Configs...');
const configValidation = WhiteLabelManager.validateAllConfigs();

if (configValidation.valid) {
  console.log('✅ All white-label configs are valid');
} else {
  console.log('❌ White-label config validation errors found:');
  configValidation.errors.forEach(error => {
    console.log(`   - ${error}`);
  });
}

// Content statistics
console.log('\n📊 Content Statistics:');
const contentStats = ContentLoader.getContentStats();
const partnerStats = WhiteLabelManager.getPartnerStats();

console.log(`   - Total content files: ${contentStats.length}`);
console.log(`   - Total partners: ${partnerStats.length}`);

// Group by tool
const toolStats = contentStats.reduce((acc, stat) => {
  if (!acc[stat.tool]) acc[stat.tool] = 0;
  acc[stat.tool]++;
  return acc;
}, {});

console.log('\n🛠️  Tools Coverage:');
Object.entries(toolStats).forEach(([tool, count]) => {
  console.log(`   - ${tool}: ${count} languages`);
});

// Partner summary
console.log('\n🤝 Partner Summary:');
partnerStats.forEach(partner => {
  console.log(`   - ${partner.partnerId}: ${partner.tools} tools, ${partner.languages} languages`);
});

// Overall validation result
const overallValid = contentValidation.valid && configValidation.valid;

console.log('\n' + '='.repeat(50));
if (overallValid) {
  console.log('🎉 All validations passed! CMS is ready for deployment.');
  process.exit(0);
} else {
  console.log('💥 Validation failed! Please fix the errors above.');
  process.exit(1);
}

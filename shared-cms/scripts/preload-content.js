#!/usr/bin/env node

import { ContentLoader, utils } from '../dist/content-engine/index.js';

console.log('🚀 SAMEBI CMS Content Preloader');
console.log('===============================');

try {
  // Clear existing cache
  console.log('\n🧹 Clearing existing cache...');
  ContentLoader.clearCache();
  console.log('✅ Cache cleared');

  // Preload all content
  console.log('\n📦 Preloading all content...');
  ContentLoader.preloadAllContent();
  console.log('✅ Content preloaded');

  // Get system status
  console.log('\n📊 System Status:');
  const status = utils.getSystemStatus();
  
  console.log(`   Version: ${status.version}`);
  console.log(`   Build Date: ${status.buildDate}`);
  console.log(`   Status: ${status.status}`);
  console.log(`   Content Files: ${status.content.totalFiles}`);
  console.log(`   Cache Size: ${status.cache.contentCacheSize}`);

  if (status.content.errors.length > 0) {
    console.log('\n⚠️  Content Errors:');
    status.content.errors.forEach(error => {
      console.log(`   - ${error}`);
    });
  }

  // Content statistics
  console.log('\n📈 Content Statistics:');
  const contentStats = ContentLoader.getContentStats();
  
  const toolGroups = contentStats.reduce((acc, stat) => {
    if (!acc[stat.tool]) acc[stat.tool] = [];
    acc[stat.tool].push(stat);
    return acc;
  }, {});

  Object.entries(toolGroups).forEach(([tool, stats]) => {
    console.log(`\n   ${tool}:`);
    stats.forEach(stat => {
      const sizeKB = (stat.size / 1024).toFixed(1);
      console.log(`     - ${stat.language}: ${sizeKB}KB (${stat.lastModified.split('T')[0]})`);
    });
  });

  console.log('\n' + '='.repeat(50));
  console.log('🎉 Content preloading completed successfully!');
  
} catch (error) {
  console.error(`❌ Preloading failed: ${error.message}`);
  process.exit(1);
}

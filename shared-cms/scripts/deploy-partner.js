#!/usr/bin/env node

import { WhiteLabelManager, TranslationManager } from '../dist/content-engine/index.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const partnerId = args[0];
const outputDir = args[1] || './deploy';

if (!partnerId) {
  console.error('❌ Usage: node deploy-partner.js <partnerId> [outputDir]');
  console.error('   Example: node deploy-partner.js psychologie-heute ./deploy');
  process.exit(1);
}

console.log(`🚀 SAMEBI CMS Partner Deployment`);
console.log(`================================`);
console.log(`Partner: ${partnerId}`);
console.log(`Output: ${outputDir}`);

try {
  // Load partner configuration
  console.log('\n📋 Loading partner configuration...');
  const partnerConfig = WhiteLabelManager.loadPartnerConfig(partnerId);
  console.log(`✅ Loaded config for: ${partnerConfig.partnerName}`);

  // Create output directory
  const partnerOutputDir = join(outputDir, partnerId);
  if (!existsSync(partnerOutputDir)) {
    mkdirSync(partnerOutputDir, { recursive: true });
  }

  // Generate CSS variables
  console.log('\n🎨 Generating CSS variables...');
  const cssVariables = WhiteLabelManager.generateCSSVariables(partnerConfig);
  writeFileSync(join(partnerOutputDir, 'variables.css'), cssVariables);
  console.log('✅ CSS variables generated');

  // Generate environment file
  console.log('\n⚙️  Generating environment configuration...');
  const envConfig = {
    VITE_PARTNER_ID: partnerConfig.partnerId,
    VITE_COMPANY_NAME: partnerConfig.branding.companyName,
    VITE_SUPPORT_EMAIL: partnerConfig.contact.email,
    VITE_DOMAIN: WhiteLabelManager.getPartnerDomain(partnerConfig),
    VITE_DEFAULT_LANGUAGE: partnerConfig.defaultLanguage,
    VITE_SUPPORTED_LANGUAGES: partnerConfig.languages.join(','),
    VITE_SUPPORTED_TOOLS: partnerConfig.tools.join(','),
    VITE_GA_TRACKING_ID: partnerConfig.analytics.googleAnalytics || '',
    VITE_FACEBOOK_PIXEL: partnerConfig.analytics.facebookPixel || '',
    VITE_DETAILED_ANALYSIS_PRICE: partnerConfig.pricing.detailedAnalysisPrice,
    VITE_CURRENCY: partnerConfig.pricing.currency
  };

  const envContent = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  writeFileSync(join(partnerOutputDir, '.env'), envContent);
  console.log('✅ Environment file generated');

  // Generate Docker configuration
  console.log('\n🐳 Generating Docker configuration...');
  const dockerConfig = {
    version: '3.8',
    services: {
      [`${partnerId}-app`]: {
        build: {
          context: '.',
          dockerfile: 'Dockerfile',
          args: Object.entries(envConfig).reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {})
        },
        container_name: `${partnerId}-stress-test`,
        ports: ['80:80'],
        restart: 'unless-stopped',
        environment: ['NODE_ENV=production'],
        labels: {
          'coolify.managed': 'true',
          'coolify.name': `${partnerConfig.partnerName} Stress Test`,
          'coolify.domain': WhiteLabelManager.getPartnerDomain(partnerConfig)
        }
      }
    }
  };

  writeFileSync(
    join(partnerOutputDir, 'docker-compose.yml'), 
    `# Generated for ${partnerConfig.partnerName}\n` + 
    `# Partner ID: ${partnerId}\n` +
    `# Generated: ${new Date().toISOString()}\n\n` +
    JSON.stringify(dockerConfig, null, 2).replace(/"/g, '')
  );
  console.log('✅ Docker configuration generated');

  // Generate content for each supported language and tool
  console.log('\n📝 Generating localized content...');
  const tm = TranslationManager.getInstance();
  
  for (const tool of partnerConfig.tools) {
    for (const language of partnerConfig.languages) {
      try {
        tm.initialize(tool, language, partnerId);
        const content = tm.getContent();
        
        const contentDir = join(partnerOutputDir, 'content', tool);
        if (!existsSync(contentDir)) {
          mkdirSync(contentDir, { recursive: true });
        }
        
        writeFileSync(
          join(contentDir, `${language}.json`), 
          JSON.stringify(content, null, 2)
        );
        
        console.log(`   ✅ ${tool}-${language}`);
      } catch (error) {
        console.log(`   ⚠️  ${tool}-${language}: ${error.message}`);
      }
    }
  }

  // Generate meta information
  console.log('\n📄 Generating deployment metadata...');
  const deploymentMeta = {
    partnerId: partnerConfig.partnerId,
    partnerName: partnerConfig.partnerName,
    domain: WhiteLabelManager.getPartnerDomain(partnerConfig),
    tools: partnerConfig.tools,
    languages: partnerConfig.languages,
    features: partnerConfig.features,
    generatedAt: new Date().toISOString(),
    version: '1.0.0'
  };

  writeFileSync(
    join(partnerOutputDir, 'deployment-meta.json'), 
    JSON.stringify(deploymentMeta, null, 2)
  );
  console.log('✅ Deployment metadata generated');

  // Generate Coolify configuration
  console.log('\n☁️  Generating Coolify configuration...');
  const coolifyConfig = {
    name: `${partnerConfig.partnerName} - Stress Test`,
    description: `White-label stress test for ${partnerConfig.partnerName}`,
    repository: 'https://github.com/PDG1999/tool-stress-checker.git',
    branch: 'main',
    buildCommand: 'npm run build',
    startCommand: 'npm start',
    port: 80,
    domains: [WhiteLabelManager.getPartnerDomain(partnerConfig)],
    environmentVariables: envConfig,
    healthCheck: {
      enabled: true,
      path: '/health',
      interval: 30,
      timeout: 10,
      retries: 3
    }
  };

  writeFileSync(
    join(partnerOutputDir, 'coolify.json'), 
    JSON.stringify(coolifyConfig, null, 2)
  );
  console.log('✅ Coolify configuration generated');

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 Partner deployment package generated successfully!`);
  console.log(`📁 Output directory: ${partnerOutputDir}`);
  console.log(`🌐 Domain: ${WhiteLabelManager.getPartnerDomain(partnerConfig)}`);
  console.log(`🛠️  Tools: ${partnerConfig.tools.join(', ')}`);
  console.log(`🌍 Languages: ${partnerConfig.languages.join(', ')}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Upload files to your deployment server');
  console.log('2. Configure DNS A-record for the domain');
  console.log('3. Deploy using Docker Compose or Coolify');
  console.log('4. Test all tools and languages');

} catch (error) {
  console.error(`❌ Deployment failed: ${error.message}`);
  process.exit(1);
}

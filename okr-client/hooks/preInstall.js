// Check if the user is running npm instead of pnpm
if (process.env.npm_config_user_agent && !process.env.npm_config_user_agent.includes('pnpm')) {
  console.log('============================== READ CAREFULLY ==============================\n');

  console.error('1️⃣  WARN: You accidentally ran npm install!');
  console.info('2️⃣  IMPORTANT: This project requires pnpm to install dependencies.');
  console.log('3️⃣  NOW: You have to delete node_modules, package-lock.json, pnpm-lock.yaml file');
  console.log('4️⃣  RUN: pnpm install\n');

  console.log('============================== READ CAREFULLY ==============================\n');

  process.exit(1);
}

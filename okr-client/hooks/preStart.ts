if (process.env.npm_config_user_agent && !process.env.npm_config_user_agent.includes('pnpm')) {
  console.error('⚠️  WARN: You must use pnpm to run the start command! \n');
  process.exit(1);
}

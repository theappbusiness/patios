module.exports = {
  '**/*.{js,ts}': ['npm run format', 'npm run lint:fix'],
  '**/*.ts': () => 'npm run typecheck',
}

// Default CLI and VS Code discovery use the portfolio suite.
// Native projects are selected explicitly via portfolio.config.ts.
const portfolio = require('./portfolio.config').default;
module.exports = {
  ...portfolio,
  projects: portfolio.projects.filter((project) => ['web', 'api'].includes(project.name)),
};

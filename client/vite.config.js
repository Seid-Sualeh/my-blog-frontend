const { defineConfig } = require("vite");

module.exports = async () => {
  const reactPlugin = (await import("@vitejs/plugin-react")).default;
  return defineConfig({
    plugins: [reactPlugin()],
    server: { port: 5173 },
  });
};

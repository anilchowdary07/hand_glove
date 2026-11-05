module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "nativewind/babel"],
    plugins: [
      "react-native-worklets/plugin",
      function () {
        return {
          visitor: {
            MetaProperty(path) {
              if (
                path.node.meta.name === "import" &&
                path.node.property.name === "meta"
              ) {
                path.replaceWithSourceString("({ env: process.env })");
              }
            },
          },
        };
      },
    ],
  };
};

import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'env',
    config: {
      default: {
        keys: ['NODE_ENV'],
      },
      schema(joi) {
        return joi.object({
          keys: joi.array().items(joi.string()).description('需要传递的环境变量名称'),
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });

  api.addUmiExports(() => ({ source: '../plugin-env/env', specifiers: ['env'] }));

  api.onGenerateFiles(() => {
    const envConfig = api.config.env || {};
    const { keys = [] } = envConfig;
    const env = {};
    keys.forEach((key) => {
      env[key] = process.env[key] || "";
    });

    api.writeTmpFile({
      path: 'plugin-env/env.ts',
      content: `export const env = ${JSON.stringify(env)};\n\nexport default env;`,
    });
  });
};

import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'env',
    config: {
      default: {
        envKeys: ['NODE_ENV'],
        argvKeys: [],
      },
      schema(joi) {
        return joi.object({
          envKeys: joi.array().items(joi.string()).description('需要传递的环境变量名称'),
          argvKeys: joi.array().items(joi.string()).description('需要传递的运行时参数的名称'),
        });
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.config,
  });

  api.addUmiExports(() => ({ source: '../plugin-env/env', specifiers: ['env'] }));

  api.addUmiExports(() => ({ source: '../plugin-env/env', specifiers: ['argv'] }));

  api.onGenerateFiles(() => {
    const envConfig = api.config.env || {};
    const { envKeys = [], argvKeys = [] } = envConfig;
    const env = {};
    const argv = {};
    envKeys.forEach((key) => {
      env[key] = process.env[key] || '';
    });
    const yargs = api.utils.yargs(process.argv);
    argvKeys.forEach((key) => {
      argv[key] = yargs.argv[key] || '';
    });

    api.writeTmpFile({
      path: 'plugin-env/env.ts',
      content: `export const env = ${JSON.stringify(env)};\n\nexport const argv = ${JSON.stringify(argv)};`,
    });
  });
};

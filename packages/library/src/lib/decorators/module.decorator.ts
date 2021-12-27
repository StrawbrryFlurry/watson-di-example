import { Type, WatsonModule, WatsonModuleOptions } from '@watsonjs/di';

export const NYA_MODULE_METADATA = '__NYA_MODULE__';

export interface NyaModuleDecoratorOptions
  extends Omit<WatsonModuleOptions, 'components'> {
  // Chose whatever name you'd like for your components
  controllers?: Type[];
}

export function NyaModule(
  options: NyaModuleDecoratorOptions = {}
): ClassDecorator {
  const moduleOptions: WatsonModuleOptions = {
    components: options.controllers,
    ...options,
  };

  // return WatsonModule(moduleOptions);
  // Or define custom metadata as well

  return (target: Type) => {
    WatsonModule(moduleOptions)(target);
    Reflect.defineMetadata(NYA_MODULE_METADATA, ':3', target);
  };
}

import { ComponentDecoratorOptions, Type, WatsonComponent } from '@watsonjs/di';

export const NYA_CONTROLLER_METADATA = '__NYA_COMPONENT__';

export interface NyaControllerDecoratorOptions
  extends ComponentDecoratorOptions {
  // Provide whatever metadata you like
  path?: string;
}

export function NyaController(path?: string): ClassDecorator;
export function NyaController(
  options?: NyaControllerDecoratorOptions
): ClassDecorator;
export function NyaController(
  options: NyaControllerDecoratorOptions | string = {}
): ClassDecorator {
  return (target: Type) => {
    let watsonComponentOptions: NyaControllerDecoratorOptions =
      typeof options === 'string' ? {} : options;

    WatsonComponent(watsonComponentOptions)(target);
    Reflect.defineMetadata(NYA_CONTROLLER_METADATA, options, target);
  };
}

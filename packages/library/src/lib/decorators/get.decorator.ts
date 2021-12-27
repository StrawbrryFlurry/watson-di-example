export const NYA_METHOD_GET_DECORATOR = '__NYA_METHOD_GET__';

export function NyaGet(routePath: string): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    const { value } = descriptor;
    Reflect.defineMetadata(NYA_METHOD_GET_DECORATOR, routePath, value);
  };
}

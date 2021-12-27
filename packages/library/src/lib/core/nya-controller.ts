import { NYA_CONTROLLER_METADATA, NyaControllerDecoratorOptions } from '@nyaa-lib/decorators';
import { ModuleRef, ProviderResolvable, Reflector, Type, WatsonComponentRef } from '@watsonjs/di';

export class NyaControllerRef<T = any> extends WatsonComponentRef<T> {
  public path: string = '';

  constructor(
    metatype: Type,
    providers: ProviderResolvable[],
    moduleRef: ModuleRef
  ) {
    super(metatype, providers, moduleRef);
    this._getControllerMetadata();
  }

  private _getControllerMetadata() {
    const meta = Reflector.reflectMetadata<
      NyaControllerDecoratorOptions | string
    >(NYA_CONTROLLER_METADATA, this.metatype);

    if (typeof meta === 'string') {
      this.path = meta;
      return;
    }

    const { path } = meta;
    this.path = path ?? '';
  }
}

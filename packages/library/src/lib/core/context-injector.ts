import {
  Binding,
  Injector,
  InjectorGetResult,
  InjectorInquirerContext,
  Providable,
  Type,
  ValueProvider,
  ɵbindProviders,
  ɵcreateBindingInstance,
} from '@watsonjs/di';

export class ExecutionContext {}

export class ContextInjector implements Injector {
  parent: Injector;
  private _records = new Map<Providable, Binding>();

  constructor(providers: ValueProvider[], parent: Injector) {
    this.parent = parent;
    const contextProviders = [
      ...providers,
      <ValueProvider>{
        provide: ExecutionContext,
        useValue: 'Some execution context',
      },
    ];

    ɵbindProviders(this, this._records, contextProviders);
  }

  get<T extends Providable<any>, R extends InjectorGetResult<T, false>>(
    typeOrToken: T,
    notFoundValue?: any,
    ctx?: Injector | null,
    inquirerContext: InjectorInquirerContext<
      Type<any> | Binding<any, any[], any, any> | typeof Injector
    > = new InjectorInquirerContext()
  ): Promise<R> {
    const binding = this._records.get(typeOrToken);

    if (binding) {
      return ɵcreateBindingInstance(binding, this, this, inquirerContext);
    }

    return this.parent.get(typeOrToken, notFoundValue, this);
  }
}

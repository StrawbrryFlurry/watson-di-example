import { NyaControllerRef } from '@nyaa-lib/core/nya-controller';
import { DeclareModuleRef, Injector, ModuleDef, ModuleRef, Type } from '@watsonjs/di';

// Use this decorator to tell Watson which class should
// be used as ModuleRef. This is required when using a
// custom component implementation.
@DeclareModuleRef()
export class NyaModuleRef<T extends object = any> extends ModuleRef<T> {
  public controllers: Type[] = [];

  constructor(
    metatype: Type,
    rootInjector: Injector,
    parent: Injector,
    moduleDef: ModuleDef
  ) {
    super(
      metatype,
      rootInjector,
      parent,
      moduleDef,
      /** If you want watson to use your own implementation for components declare this here */ NyaControllerRef
    );
    this.controllers = this.components;
  }
}

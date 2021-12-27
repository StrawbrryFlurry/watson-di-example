import { ApplicationRef, Injector, ModuleLoader, Type } from '@watsonjs/di';
import { Application } from 'express';

import { RequestHandler, RoutesExplorer } from './routing';

export class NyaApplication extends ApplicationRef {
  private constructor(injector: Injector) {
    super(injector);
  }

  public static async create(module: Type): Promise<NyaApplication> {
    const rootInjector = Injector.create([]);
    const moduleLoader = new ModuleLoader(rootInjector);
    const rootModuleRef = await moduleLoader.resolveRootModule(module);
    const applicationRef = new NyaApplication(rootInjector);

    // Here you can do additional stuff with your modules
    // I.e. iterating through the module container
    // or following the `rootModuleRef` imports to go
    // through all modules.

    return applicationRef;
  }

  public async start(): Promise<Application> {
    const handler = await this._resolveAndBindRoutes();
    return handler.start();
  }

  private async _resolveAndBindRoutes(): Promise<RequestHandler> {
    const routesExplorer = new RoutesExplorer(this.rootInjector);
    const routes = await routesExplorer.explore();
    const requestHandler = new RequestHandler(routes);
    return requestHandler;
  }
}

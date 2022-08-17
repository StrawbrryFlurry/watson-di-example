import { NyaControllerRef, NyaModuleRef } from '@nyaa-lib/core';
import { ContextInjector } from '@nyaa-lib/core/context-injector';
import {
  NYA_METHOD_GET_DECORATOR,
  NYA_REQ_PARAM_METADATA,
  NYA_RES_PARAM_METADATA,
  ReqResParameterMetadata,
} from '@nyaa-lib/decorators';
import { REQUEST, RESPONSE } from '@nyaa-lib/routing';
import { isNil, log } from '@nyaa-lib/utils';
import {
  Injector,
  MethodDescriptor,
  ModuleContainer,
  Providable,
  Reflector,
  Type,
} from '@watsonjs/di';
import { Request, Response } from 'express';
import { red, white, yellow } from 'cli-color';

export type NyaRequestCallbackFn = (
  request: Request,
  response: Response
) => void;

export interface ResolvedRoute {
  callback: NyaRequestCallbackFn;
  controller: NyaControllerRef;
  method: 'get';
  path: string;
  methodName: string;
}

/**
 * Helper class to look through
 * all controllers registered
 * in the application and resolve
 * their routing path.
 */
export class RoutesExplorer {
  public get routes() {
    return this._routesMap;
  }
  private _routesMap = new Map<string, ResolvedRoute>();
  private _controllerCache = new WeakSet<any>();

  constructor(private _injector: Injector) {}

  public async explore(): Promise<Map<string, ResolvedRoute>> {
    const moduleContainerRef = await this._injector.get(ModuleContainer);
    const { modules } = moduleContainerRef;

    for (const [metatype, moduleRef] of modules) {
      log('RoutesExplorer', `Exploring routes of ${white(metatype.name)}`);
      const { controllers } = <NyaModuleRef>moduleRef;

      if (isNil(controllers)) {
        continue;
      }

      for (const controller of controllers) {
        const controllerRef = await moduleRef.get<NyaControllerRef>(controller);
        await this._exploreRoutesOfController(
          <NyaModuleRef>moduleRef,
          controllerRef
        );
      }
    }

    return this._routesMap;
  }

  private async _exploreRoutesOfController(
    moduleRef: NyaModuleRef,
    controllerRef: NyaControllerRef
  ) {
    const { metatype } = controllerRef;
    const methods = Reflector.reflectMethodsOfType(metatype);

    for (const method of methods) {
      const { descriptor } = method;
      const path = Reflector.reflectMetadata<string>(
        NYA_METHOD_GET_DECORATOR,
        descriptor
      );

      if (isNil(path)) {
        continue;
      }

      const route = this._bindGetMethod(moduleRef, controllerRef, path, method);
      this._routesMap.set(route.path, route);
    }
  }

  private _bindGetMethod(
    moduleRef: NyaModuleRef,
    controllerRef: NyaControllerRef,
    path: string,
    method: MethodDescriptor
  ): ResolvedRoute {
    const { propertyKey } = method;
    const { path: controllerPath } = controllerRef;
    /**
     * In an actual app you would probably
     * also include the paths from parent
     * controllers...
     */
    const getPath = `${controllerPath}/${path}`;
    const handlerPath = getPath.startsWith('/') ? getPath : `/${getPath}`;

    const callback = this._createCallbackFn(moduleRef, controllerRef, method);
    log(
      'RoutesExplorer',
      `Register route: ${white(handlerPath)} in ${white(controllerRef.name)}`
    );

    return {
      path: handlerPath,
      controller: controllerRef,
      method: 'get',
      callback: callback,
      methodName: propertyKey,
    };
  }

  private _createCallbackFn(
    moduleRef: NyaModuleRef,
    controllerRef: NyaControllerRef,
    method: MethodDescriptor
  ): NyaRequestCallbackFn {
    const { metatype } = controllerRef;
    const { descriptor, propertyKey } = method;
    const params = this._getHandlerParams(metatype, propertyKey);

    return async (request: Request, response: Response) => {
      const ctxProviders = [
        {
          provide: REQUEST,
          useValue: request,
        },
        {
          provide: RESPONSE,
          useValue: response,
        },
      ];

      const contextInjector = new ContextInjector(ctxProviders, controllerRef);

      // Ways to create component instances using the new `ComponentFactory`:
      /**
       * // Using the `ComponentFactoryRef` of `ComponentRef`
       * const controllerFactory = await controllerRef.get(ComponentFactoryRef);
       * const controller = await controllerFactory.create(contextInjector);
       *
       * // Using the `ComponentFactoryResolver` of `ModuleRef`
       * const controllerFac = await moduleRef.componentFactoryResolver.resolve(
       *  metatype
       *  );
       * const controller = await controllerFac.create(null, contextInjector);
       */

      // Using the `createComponent` method on `ModuleRef`
      const controller = await moduleRef.createComponent(
        metatype,
        contextInjector
      );

      if (this._controllerCache.has(controller)) {
        log(
          'RouteHandler',
          `Get instance of ${white(metatype.name)} from cache`
        );
      } else {
        log('RouteHandler', `Create instance of ${white(metatype.name)}`);
        this._controllerCache.add(controller);
      }

      const deps: unknown[] = [];

      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        log(
          'RouteHandler',
          `Resolve parameter provider dependency [${white(param.name)}]`
        );
        const dep = await contextInjector.get(param);
        deps[i] = dep;
      }

      log(
        'RouteHandler',
        `Call controller request handler ${white(metatype.name)}.${white(
          propertyKey
        )}${red('(')}${params
          .map((p) => yellow(p.name))
          .join(white(', '))}${red(')')}`
      );
      return descriptor.apply(controller, deps);
    };
  }

  private _getHandlerParams(
    controller: Type,
    propertyKey: string
  ): Providable[] {
    const methodParams: Providable[] = Reflector.reflectMethodParameters(
      controller,
      propertyKey
    );

    const hasReqMetadata = Reflector.reflectMetadata<ReqResParameterMetadata>(
      NYA_REQ_PARAM_METADATA,
      controller,
      propertyKey
    );

    if (hasReqMetadata) {
      const { parameterIdx } = hasReqMetadata;
      methodParams[parameterIdx] = REQUEST;
    }

    const hasResMetadata = Reflector.reflectMetadata<ReqResParameterMetadata>(
      NYA_RES_PARAM_METADATA,
      controller,
      propertyKey
    );

    if (hasResMetadata) {
      const { parameterIdx } = hasResMetadata;
      methodParams[parameterIdx] = RESPONSE;
    }

    return methodParams;
  }
}

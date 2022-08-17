import { NyaRequestCallbackFn, ResolvedRoute } from '@nyaa-lib/routing';
import { log } from '@nyaa-lib/utils';
import { InjectionToken, InjectorLifetime } from '@watsonjs/di';
import { white } from 'cli-color';
import express, { Application, Request, Response } from 'express';

export const REQUEST = new InjectionToken('The request object', {
  providedIn: 'ctx',
  lifetime: InjectorLifetime.Event,
});
export const RESPONSE = new InjectionToken('The response object', {
  providedIn: 'ctx',
  lifetime: InjectorLifetime.Event,
});

export class RequestHandler {
  private _client = express();

  constructor(private routesMap: Map<string, ResolvedRoute>) {
    this._bind();
  }

  private _bind() {
    for (const [path, route] of this.routesMap) {
      const { method, callback, controller, methodName } = route;
      const handler = this._interceptCallback(callback);
      this._client.get(path, handler);
      log('RequestHandler', `Mapped ${white(`[${method}]`)} ${path}`);
    }
  }

  public start(): Promise<Application> {
    return new Promise((res) => {
      log(
        'Application',
        `Started listening on: ${white('http://localhost:3000')}`
      );
      this._client.listen(3000, () => res(this._client));
    });
  }

  private _interceptCallback(callback: NyaRequestCallbackFn) {
    return async (request: Request, response: Response) => {
      let handlerResponse: any;
      try {
        handlerResponse = await callback(request, response);
      } catch (err: unknown) {
        response.send(
          `Yikes, something didn't work out like we expected :( - \n ${err}`
        );
      }

      if (response.headersSent) {
        return;
      }

      response.send(JSON.stringify(handlerResponse));
    };
  }
}

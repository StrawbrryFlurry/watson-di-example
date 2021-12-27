import { HatsService } from '@ex/features/hats';
import { NyaController, NyaGet, Req, Res } from '@nyaa';
import { AfterResolution, Injector, WatsonComponentRef } from '@watsonjs/di';
import { Request, Response } from 'express';

@NyaController()
export class CatsController implements AfterResolution {
  // Getting references to the component
  constructor(
    private _componentRef: WatsonComponentRef,
    private _hatService: HatsService
  ) {}

  afterResolution(injector: Injector): void {
    console.log(this._hatService.getHats());
  }

  @NyaGet('nyaa')
  getHandler(@Req() request: Request, @Res() response: Response) {
    return 'Hi :3';
  }
}

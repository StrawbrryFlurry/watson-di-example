import { HATS_TOKEN } from '@ex/features/hats';
import { NyaController, NyaGet } from '@nyaa';
import { RESPONSE } from '@nyaa-lib/routing';
import { Inject } from '@watsonjs/di';
import { Response } from 'express';

@NyaController('woof')
export class DogsController {
  constructor(
    @Inject(HATS_TOKEN) private _hats: string,
    // Context constructor injection also works
    @Inject(RESPONSE) private _response: Response
  ) {}

  @NyaGet()
  public dogsHandler() {
    return 'Hi 🐶';
  }
}

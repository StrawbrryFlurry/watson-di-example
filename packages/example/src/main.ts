import { NyaApplication, NyaControllerRef } from '@nyaa';
import { Injectable, W_GLOBAL_PROV } from '@watsonjs/di';

import { AppModule } from './app.module';
import { CatsController, CatsModule } from './features';

const bootstrap = async () => {
  const app = await NyaApplication.create(AppModule);

  // Some examples of how you can use the ApplicationRef.
  const catsModuleRef = await app.getModuleRef(CatsModule);
  const catsComponentRef = await catsModuleRef.get<
    NyaControllerRef<CatsController>
  >(CatsController);

  console.log(Injectable[W_GLOBAL_PROV]);

  await app.start();
  console.log('Started :3');
};
bootstrap();

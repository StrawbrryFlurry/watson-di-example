import { NyaApplication, NyaControllerRef } from '@nyaa';
import { log } from '@nyaa-lib/utils';
import { white } from 'cli-color';

import { AppModule } from './app.module';
import { CatsController, CatsModule } from './features';

const bootstrap = async () => {
  const app = await NyaApplication.create(AppModule);

  // Some examples of how you can use the ApplicationRef.
  const catsModuleRef = await app.getModuleRef(CatsModule);
  const catsComponentRef = await catsModuleRef.get<
    NyaControllerRef<CatsController>
  >(CatsController);

  await app.start();
  log('Bootstrap', white(`Application started`));
};
bootstrap();

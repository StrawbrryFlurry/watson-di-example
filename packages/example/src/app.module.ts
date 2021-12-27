import { NyaModule } from '@nyaa';

import { CatsModule, DogsModule } from './features';

@NyaModule({ imports: [CatsModule, DogsModule] })
export class AppModule {}

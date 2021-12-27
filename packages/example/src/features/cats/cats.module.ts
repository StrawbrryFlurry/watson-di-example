import { NyaModule } from '@nyaa';

import { CatsController } from './cats.controller';

@NyaModule({
  controllers: [CatsController],
})
export class CatsModule {}

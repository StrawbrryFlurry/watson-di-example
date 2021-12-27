import { HatsModule } from '@ex/features/hats';
import { NyaModule } from '@nyaa';

import { DogsController } from './dogs.controller';

@NyaModule({
  imports: [HatsModule.forFeatureAsync()],
  controllers: [DogsController],
})
export class DogsModule {}

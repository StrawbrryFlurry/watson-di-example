import { FactoryProvider, InjectionToken, ModuleRef, WatsonDynamicModule } from '@watsonjs/di';

export const HATS_TOKEN = new InjectionToken('Hats :3', {
  providedIn: 'module',
});

const HatsCustomProvider: FactoryProvider = {
  provide: HATS_TOKEN,
  useFactory: (moduleRef: ModuleRef) => {
    return moduleRef.name;
  },
  deps: [ModuleRef],
};

export class HatsModule {
  static async forFeatureAsync(): Promise<WatsonDynamicModule> {
    return {
      module: HatsModule,
      providers: [HatsCustomProvider],
      exports: [HATS_TOKEN],
    };
  }
}

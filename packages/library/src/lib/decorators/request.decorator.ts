export const NYA_REQ_PARAM_METADATA = '__NYA_REQ_PARAM__';
export const NYA_RES_PARAM_METADATA = '__NYA_RES_PARAM__';

export interface ReqResParameterMetadata {
  parameterIdx: number;
}

export function Req(): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    parameterIdx: number
  ) => {
    const metadata: ReqResParameterMetadata = {
      parameterIdx,
    };

    Reflect.defineMetadata(
      NYA_REQ_PARAM_METADATA,
      metadata,
      target.constructor,
      propertyKey
    );
  };
}
export function Res(): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    parameterIdx: number
  ) => {
    const metadata: ReqResParameterMetadata = {
      parameterIdx,
    };

    Reflect.defineMetadata(
      NYA_RES_PARAM_METADATA,
      metadata,
      target.constructor,
      propertyKey
    );
  };
}

import { Injectable } from '@watsonjs/di';

@Injectable({})
export class HatsService {
  getHats(): string[] {
    return ["Watson's hat :o"];
  }
}

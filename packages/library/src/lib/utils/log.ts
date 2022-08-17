import { blue, green, yellow } from 'cli-color';

export function log(context: string, message: string) {
  process.stdout.write(
    `${yellow(`[Watson]`)} - ${blue(`[${context}]`)} ${green(message)}\n`
  );
}

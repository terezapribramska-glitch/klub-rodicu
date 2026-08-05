import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

/** Používejte pouze v Astro frontmatteru nebo na serveru, nikdy v prohlížeči. */
export const keystaticReader = createReader(process.cwd(), keystaticConfig);

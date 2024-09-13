import type { Plugin } from 'rollup';

export interface RollupFilenameOptions {
  [id: string]: (filename: string) => string;
}

/**
 * A Rollup plugin which loads __filename from memory.
 */
export default function filename(modules: RollupFilenameOptions): Plugin;

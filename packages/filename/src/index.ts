import * as path from 'path';

import type { Plugin } from 'rollup';

import type { RollupFilenameOptions } from '../types';

const PREFIX = `\0virtual:`;
const TYPE_PREFIX = `____`;

export default function filename(modules: RollupFilenameOptions): Plugin {
  const resolvedIds = new Map(Object.entries(modules));
  return {
    name: 'filename',

    resolveId(id, importer) {
      if (resolvedIds.has(id)) {
        let importerSuffix = '';
        if (importer) {
          const filepath = `${importer.replace(/\?.+$/, '')}?${TYPE_PREFIX}${id}`;
          importerSuffix = path.relative(process.cwd(), filepath);
        }
        return PREFIX + importerSuffix;
      }

      return null;
    },

    load(id) {
      if (id.startsWith(PREFIX)) {
        const [importer, idNoPrefix] = id.slice(PREFIX.length).split(`?${TYPE_PREFIX}`);
        const module = resolvedIds.get(idNoPrefix);

        if (module) {
          return module(importer);
        }
      }

      return null;
    }
  };
}

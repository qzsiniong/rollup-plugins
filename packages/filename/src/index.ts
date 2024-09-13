import * as path from 'path';

import type { Plugin } from 'rollup';

import type { RollupFilenameOptions } from '../types';

const PREFIX = `\0virtual:`;
const IMPORTER_SEP = `/`;

export default function filename(modules: RollupFilenameOptions): Plugin {
  const resolvedIds = new Map(Object.entries(modules));
  return {
    name: 'filename',

    resolveId(id, importer) {
      if (resolvedIds.has(id)) {
        let importerSuffix = '';
        if (importer) {
          importerSuffix = IMPORTER_SEP + path.relative(process.cwd(), importer);
        }
        return PREFIX + id + importerSuffix;
      }

      return null;
    },

    load(id) {
      if (id.startsWith(PREFIX)) {
        const idx = id.indexOf(IMPORTER_SEP);
        if (idx !== -1) {
          const idNoPrefix = id.substring(0, idx).slice(PREFIX.length);
          const importer = id.substring(idx + IMPORTER_SEP.length);
          const module = resolvedIds.get(idNoPrefix);

          if (module) {
            return module(importer);
          }
        }
      }

      return null;
    }
  };
}

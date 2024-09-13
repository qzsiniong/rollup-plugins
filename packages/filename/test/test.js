const path = require('path');

const md5 = require('md5');

const test = require('ava');

const plugin1 = require('..');

const theFilename = __filename;
const relativeFilename = path.relative(process.cwd(), theFilename);

test('loads __filename from memory', (t) => {
  const plugin = plugin1({
    filename: (s) => s
  });

  const resolved = plugin.resolveId('filename', theFilename);

  t.is(resolved, `\0virtual:filename/${relativeFilename}`);
  t.is(plugin.load(resolved), relativeFilename);
});

test('loads md5(__filename) from memory', (t) => {
  const plugin = plugin1({
    filename_md5: (filename) => md5(filename)
  });

  const resolved = plugin.resolveId('filename_md5', theFilename);

  t.is(resolved, `\0virtual:filename_md5/${relativeFilename}`);
  t.is(plugin.load(resolved), md5(relativeFilename));
});

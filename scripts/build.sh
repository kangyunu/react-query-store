
rm -r dist
node scripts/esbuild.js
tsc --emitDeclarationOnly
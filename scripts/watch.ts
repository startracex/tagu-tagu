import esbuild from "esbuild";

const context = await esbuild.context({
	entryPoints: ["src/index.ts"],
	outfile: "dist/bundle.min.js",
	bundle: true,
	minify: true,
	format: "esm",
});

context.watch();

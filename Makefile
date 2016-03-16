all:
	rm -rf gosha
	mkdir gosha
	node ./node_modules/webpack/bin/webpack.js --config webpack.config.js
	rsync -av --exclude-from '.goshaignore' . ./gosha
	rm -rf ./out
	find . -type d -name '[0-9]..' -maxdepth 1 -exec rm -rf {} +

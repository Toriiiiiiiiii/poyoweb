var VALID_EXTENSIONS = [
    'html', 'htm', 'txt', 'text', 'css', 'js', 'jpg', 'jpeg', 'png', 'apng', 'gif', 'svg', 'md', 'markdown', 'eot', 'ttf', 'woff', 'woff2', 'json', 'geojson', 'csv', 'tsv', 'mf', 'ico', 'pdf', 'asc', 'key', 'pgp', 'xml', 'mid', 'midi', 'manifest', 'otf', 'webapp', 'less', 'sass', 'rss', 'kml', 'dae', 'obj', 'mtl', 'scss', 'webp', 'avif', 'xcf', 'epub', 'gltf', 'bin', 'webmanifest', 'knowl', 'atom', 'opml', 'rdf', 'map', 'gpg', 'resolveHandle', 'pls', 'yaml', 'yml', 'toml', 'osdx', 'mjs', 'cjs', 'ts', 'glb', 'py', 'php'
];

var VALID_EDITABLE_EXTENSIONS = [
    'html', 'htm', 'txt', 'js', 'css', 'scss', 'md', 'markdown', 'manifest', 'less', 'webmanifest', 'xml', 'json', 'opml', 'rdf', 'svg', 'gpg', 'pgp', 'resolveHandle', 'pls', 'yaml', 'yml', 'toml', 'osdx', 'mjs', 'cjs', 'ts', 'php',
];

var maxFileNameLength = 50;

function checkFileName(name) {
    name.toLowerCase();
    name.replace(/\s/g, '');
    if (name.length > maxFileNameLength) {
    	return false;
    }
    for (let i = 0; i < VALID_EXTENSIONS.length; i++) {
        if (name.endsWith(VALID_EXTENSIONS[i])) {
            console.log('Valid extension found:', VALID_EXTENSIONS[i]);
            return name.replace(/[^a-zA-Z0-9_-]/g, "");
        }
    }
    return false;
}

function checkCreatableFile(name) {
    name.toLowerCase();
    name.replace(/\s/g, '');
    if (name.length > maxFileNameLength) {
       	return false;
    }
    for (let i = 0; i < VALID_EDITABLE_EXTENSIONS.length; i++) {
        if (name.endsWith(VALID_EDITABLE_EXTENSIONS[i])) {
            console.log('Valid extension found:', VALID_EDITABLE_EXTENSIONS[i]);
            return name.replace(/[^a-zA-Z0-9_-]/g, "");
        }
    }
    return false;
}

function checkEditableFile(name) {
	if (name.length > maxFileNameLength) {
    	return false;
    }
    name.toLowerCase();
    name.replace(/\s/g, '');
    for (let i = 0; i < VALID_EDITABLE_EXTENSIONS.length; i++) {
        if (name.endsWith(VALID_EDITABLE_EXTENSIONS[i])) {
            console.log('Valid extension found:', VALID_EDITABLE_EXTENSIONS[i]);
            return name.replace(/[^a-zA-Z0-9_-]/g, "");
        }
    }
    return false;
}

module.exports = {checkCreatableFile, checkEditableFile, checkFileName};

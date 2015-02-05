var Readable = require('stream').Readable;
var glob = require('glob');

function withoutHash(filename) {
	return filename.replace(/(.*)(-[^.]+)(\.js)$/, '$1$3');
}

module.exports = function manifestify(dir, filePattern) {
	var rs = new Readable();
	rs._read = function () {};

	glob(filePattern, { cwd: dir }, function onGlobResult(err, files) {
		if (err) {
			return rs.emit('error', err);
		}

		var result = files.reduce(function(manifest, filename) {
			manifest[withoutHash(filename)] = filename;
			return manifest;
		}, {});

		rs.push(JSON.stringify(result));
		rs.push(null);
	});

	return rs;
};
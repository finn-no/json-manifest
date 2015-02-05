var assert = require('assert');
var Readable = require('stream').Readable;

var expectedManifest = {
	"fixtures/common.js":"fixtures/common-e4137d8d.js"
};

describe('npm module', function() {

	var manifestify = require('..');

	it('should expose a function', function() {
		assert.equal(typeof(manifestify), 'function');
	});

	it('should return a readable stream', function() {
		var stream = manifestify('test', 'fixtures/*.js');
		assert(stream instanceof Readable);
	});

	it('should push stringified JSON manifest into returned stream', function(done) {
		manifestify('test', 'fixtures/*.js').on('data', function(manifestData) {
			assert.equal(manifestData, JSON.stringify(expectedManifest));
			done();
		});
	});

});

describe('cli', function() {

	var exec = require('child_process').exec;

	it('should give syntax hints into stderr when runned wrong number of parameters', function(done) {
		exec('bin/manifestify', function(err, stdout, stderr) {
			assert.notEqual(stderr.indexOf('syntax'), -1);
			done();
		});
	});

	it('should write JSON manifest into stdout', function(done) {
		exec('bin/manifestify test fixtures/*.js', function(err, stdout, stderr) {
			assert.equal(stdout, JSON.stringify(expectedManifest));
			done();
		});
	});

});
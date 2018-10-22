var solc = require('solc')
const semver = require('semver');
const tape = require('tape');
const fs = require('fs');
var testdir = 'demo/'
if (process.argv[2]) {
    testdir = process.argv[2] + '/'
}
console.log(solc.semver())
console.log(semver.lt(solc.semver(), '0.5.0'))

tape('Deterministic Compilation', function (t) {
    t.test('DAO', function (st) {
        var input = {};
        var libs = {};
        var prevBytecode = null;
        fs.readdir(testdir, (err, files) => {
            var i;
            for (i in files) {
                var file = files[i];
                if (file.toString().endsWith(".sol")) {
                    input[file] = fs.readFileSync(testdir + file, 'utf8');
                }
            }
            var findImports = function (path) {
                var content = fs.readFileSync(testdir + path, 'utf8');
                return { contents: content }

            }
            var output = solc.compile({ sources: input }, 1, findImports);
            for (var contractName in output.contracts) {
                // output.contracts[contractName].bytecode
                // output.contracts[contractName].interface
                console.log(contractName)
                var abiFile = testdir + contractName.replace('/', '_').replace('.', '_').replace(':', '_') + '_abi'
                var binFile = testdir + contractName.replace('/', '_').replace('.', '_').replace(':', '_') + '_bin'
                fs.writeFileSync(binFile, output.contracts[contractName].bytecode, err => { console.log('write bin file faile:', err) })                
                fs.writeFileSync(abiFile, output.contracts[contractName].interface, err => { console.log('write abi file faile:', err) })
                fs.rename(abiFile, abiFile.replace('_abi', '.abi'))
                fs.rename(binFile, binFile.replace('_bin', '.bin'))
            }
        })
        st.end();
    });
});
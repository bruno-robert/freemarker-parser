const freemarker = require('../index')
const fs = require('fs')
const path = require('path')
const assert = require('assert')

const parser = new freemarker.Parser()

const testsPath = path.join(__dirname, '/data/')
const tests = fs.readdirSync(testsPath)
  .filter(f => fs.statSync(path.join(testsPath, f)).isDirectory())

for (const name of tests) {
  describe(name, function () {
    it('should have no errors', function () {
      const dir = path.join(testsPath, name)
      try {
        const file = path.join(dir, 'template.ftl')
        const code = fs.readFileSync(file, 'utf8')
        const ast = parser.parse(code, file)

        fs.writeFileSync(path.join(dir, 'tokens.json'), stringify(parser.tokens))
        fs.writeFileSync(path.join(dir, 'ast.json'), stringify(ast))
      } catch (e) {
        assert.fail(e.message)
      }
    })
  })
}

function stringify (o) {
  var cache = []
  const json = JSON.stringify(o, function (key, value) {
    if (key.startsWith('$')) {
      return
    }
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  }, 2)
  cache = null // Enable garbage collection
  return json
}

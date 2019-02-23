const path = require('path')
const fs = require('fs')

module.exports = {
  components: 'src/components/**/[A-Z]*.js',
  ignore: ['**/mock.js', '**/*.test.js'],
  require: [path.join(__dirname, './src/index.css')],
  /**
   * @see https://react-styleguidist.js.org/docs/cookbook.html#how-to-display-the-source-code-of-any-file
   */
  updateExample(props, exampleFilePath) {
    // props.settings are passed by any fenced code block, in this case
    const { settings, lang } = props
    // "../mySourceCode.js"
    if (typeof settings.file === 'string') {
      // "absolute path to mySourceCode.js"
      const filepath = path.resolve(exampleFilePath, settings.file)
      // displays the block as static code
      settings.static = true
      // no longer needed
      delete settings.file
      return {
        content: fs.readFileSync(filepath, 'utf8'),
        settings,
        lang
      }
    }
    return props
  }
}

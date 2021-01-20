const md = require('markdown-it')()
const isProduction = process.env.NODE_ENV === 'production'
const wrap = function (render) {
  return function () {
    return render.apply(this, arguments)
      .replace('<code v-pre class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">')
  }
}

module.exports = {
  publicPath: isProduction ? '././' : '/',
  devServer: {
    // 自动开启浏览器
    open: true
  },
  chainWebpack: (config) => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true,
        preventExtract: true,
        use: [
          [require('markdown-it-container'), 'demo', {
            validate: function (params) {
              return params.trim().match(/^demo\s*(.*)$/)
            },

            render: function (tokens, idx) {
              var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
              if (tokens[idx].nesting === 1) {
                // 获取描述内容
                var description = (m && m.length > 1) ? m[1] : ''
                var descriptionHTML = description ? md.render(description) : ''
                // 获取代码块内容
                var content = tokens[idx + 1].content
                // 使用自定义开发组件【DemoBlock】来包裹内容并且渲染成案例和代码示例
                return `<demo-block class="demo-box">
                            <div class="source" slot="source">${content}</div>
                            ${descriptionHTML}
                            <div class="highlight" slot="highlight">`
              }
              return '</div></demo-block>\n'
            }
          }],
          [require('markdown-it-container'), 'tip'],
          [require('markdown-it-container'), 'warning']
        ],
        preprocess: function (MarkdownIt, source) {
          MarkdownIt.renderer.rules.table_open = function () {
            return '<table class="table">';
          };
          MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence)
          return source;
        }
      })
  }
}

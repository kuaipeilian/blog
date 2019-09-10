module.exports = {
  base: '/blog/',
  dest: 'docs',
  title:'快陪练技术博客',
  description:'陪孩子快乐练琴，成就更美好的未来！',
  head:[
    ['link', { rel: 'icon', href: 'favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  themeConfig: {
    sidebarDepth: 3,
    navBar: true,
    nav: [
      {
        text: '广纳英才',
        link: '/job/'
      },
      {
        text: '实战分享',
        items: [
          { text: 'flutter混合开发', link: '/share/flutter'},
          { text: 'vue服务端渲染', link: '/share/ssr'},
          { text: '小程序开发总结', link: '/share/mp'},
          { text: 'go+vue前后端分离实战', link: '/share/iris'},
        ]
      },
      {
        text: '大前端教程',
        link: '/fe/vue'
      },
    ],
    sidebar: {
      '/fe/': genSidebarConfig('大前端教程', ['vue', 'VueRouter', 'vuex',  'linux', 'vscode', 'node', 'code', 'suanfa', 'ngnix', 'pm2']),
    }
  }
}

function genSidebarConfig (title, children) {
  return [
    { title, children }
  ]
}

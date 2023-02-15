## react18 is supported now ! 
# focus-center
    focus尝试解决的问题:提高业务组件的复用性，让你的团队可以快速的开发或者维护页面的业务逻辑，可以让你的团队把重心放在开发业务组件上。看到这里可能你会有点不明白，作者说的什么东西啊，别急，我会慢慢解释。
    现在前端页面的开发早变成了一个个的组件，但是组件应该是和复用性挂钩的,这也是评价一个组件好坏的指标之一。如果业务重复，ui重复，这个时候如果还是在页面写重复的组件，无疑是在浪费工作量，并且据我所知在页面工程上进行组件的维护是一个非常不吃力的做法，并且还会增加整个工程的混乱度，团队还会不停的写着重复的代码。
    正确的做法是需要进行业务组件的沉淀，将它从页面工程分离，进行单独的维护，将焦点放在业务组件上，然后再下放到你的页面中。这样做的好处就是可以解放整个团队的生产力。
    

## focus需要结合focus-loader来使用，入口是index.view文件

安装
```
npm install focus-center focus-loader --save;
```

```javascript
// loader 规则从下到上，从右到左,所以focus-loader需要在babel-loader后面
module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.view$/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'focus-loader',
            options: {

            }
          }],
        exclude: /node_modules/,
      },
    ]
  }
```
tips:一般的你可能会需要配置多个入口文件(src/pageOne/index.view,src/pageTwo/index.view,...)    


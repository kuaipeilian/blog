---
sidebar: auto
collapsable: false
---
前天flutter 更新到1.9.1版本并且把flutter_web 合到了master分支，也就是说可以通过flutter直接构建web项目

## 尝试

>ps: 目前还是开发版本，并没有稳定生产环境还不能使用，但是比之前切换依赖要有很大的改进

1. 下载 flutter sdk

由于是在mast分支所以执行

     flutter channel master
     flutter upgrade

2. 设置支持web

        flutter config --enable-web

  也可以直接修复`~/.flutter_settings `文件

3. 执行`flutter devices`就可以看到

        Chrome • chrome • web-javascript • Google Chrome 76.0.3809.100
4. 执行`flutter run -d chrome`可以开发运行
5. 如果老项目执行

       flutter create .

6. 打生产包执行

        flutter build web

## 总结

	flutter channel master
	flutter upgrade
	flutter config --enable-web
	cd <into project directory>
	flutter create .
	flutter run -d chrome
---
sidebar: auto
collapsable: false
---
历经一个多月调研，以及半个月的开发，我们终于在快陪练的学生端中集成了flutter，重构了订单列表和详情页，在此分享一下实战的过程。

## 调研阶段
团队中有几个人之前都做过react native 开发，只有一个人曾在商业APP中的ios端集成过flutter，而笔者一直都很感兴趣，但也只是搭建过环境，跑跑一些开源的flutter项目，因此在决定使用flutter之前，还是认真地从官网、各公司的实战的分享等去调研了一下。

### flutter 简介
Flutter是Google开发并于2017年5月开源的一套全新的跨平台、开源UI框架，可以快速在iOS和Android上构建高质量的原生用户界面，并且是未来新操作系统Fuchsia的默认开发套件。

与React Native 或weex 等支持多端开发APP的思路不同，Flutter则开辟了一种全新的思路，从头到尾重写一套跨平台的UI框架，包括UI控件、渲染逻辑甚至开发语言。

渲染引擎依靠跨平台的Skia图形库来实现，依赖系统的只有图形绘制相关的接口，可以在最大程度上保证不同平台、不同设备的体验一致性。

逻辑处理使用支持AOT的Dart语言，并专门为客户端优化，执行效率也比JavaScript高得多。

### flutter 架构
从Flutter官方提供的架构图我们可以看到，Flutter由框架和引擎两大部分组成：![Flutter架构图.png](https://upload-images.jianshu.io/upload_images/11988064-ac8f7287bdbf5b33.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其中，框架部分完全使用Dart语言实现，它实现了一套基础库，并且有着清晰的分层架构，自上而下我们简单介绍一下：
- Material 和Cupertino 层是Flutter在基础组件库之上提供的两种视觉风格的组件库；
- Widgets层是Flutter提供的的一套基础组件库；
- Rendering层是依赖于dart UI层的一个抽象布局层，用于构建UI树，且能通过计算UI树变化的部分，来更新UI树，最终将UI树绘制到屏幕上，这是框架最核心的部分；
- Animation、Painting、Gestures 层是Flutter引擎暴露的底层UI库，对应的是Flutter中的dart:ui包，提供动画、手势及绘制能力；
- Foundation层定义的大都是非常基础的、提供给其他所有层使用的工具类和方法。

而Flutter引擎部分则是纯 C++实现的 SDK，包括了 Skia引擎、Dart运行时、文字排版引擎等。

### flutter学习资料
调研并落地一门新技术，资料是关键，这里列举一些我们觉得很有用的一些资料：
- 英文官网：[http://flutter.io/](http://flutter.io/)
- 中文文档：[https://flutterchina.club/docs/](https://flutterchina.club/docs/)
- 来自滴滴架构师wendux的入门书籍flutter实战[https://book.flutterchina.club/](https://book.flutterchina.club/)
- 国内最早落地flutter的闲鱼团队掘金系列分享：[https://juejin.im/user/5ac2db47f265da2393774122](https://juejin.im/user/5ac2db47f265da2393774122)

### flutter 的使用情况
#### 国内情况
国内阿里的闲鱼团队于2018年就广泛使用flutter了，并且和Google团队进行了紧密地合作，阿里体系内也有多个商业APP使用了flutter。

而腾讯中手机QQ 则开源基于Flutter 的动态化框架MXFlutter ，腾讯翻译君Android客户端也集成Flutter，可以看到腾讯系的也有不同团队试水了flutter。

而其他知名互联网公司美团和滴滴等也能从网上搜到他们的实战分享，小公司也有不少进行了尝试。

可以看到，因为谷歌的大力推广，flutter成了各APP开发不得不考虑的技术解决方案！

#### 国外情况
不仅国内很多公司在尝试使用flutter开发原生APP，国外的主流公司也在主流产品上集成了flutter模块，很多创业公司都将flutter作为开发原生app的首选。

## flutter 混合开发实战
经过半个月的努力，我们成功在快陪练学生端的2.4.0版本，集成了flutter模块的功能，实现了订单列表和详情等页面的flutter化。

### flutter 模块开发

  1.  [首先配置环境](https://flutterchina.club/setup-macos/)
  2. 执行`flutter create -t module my_flutter`，创建flutter模块
  3. flutter模块开发按照正常flutter项目开发既可，入口文件需要单独配置
  ```
  void main() async {
    // 为了单独开发，我们通过判断defaultRouteName来配置是否为flutter环境启动还是原生混合方式启动，来选择初始化一起配置信息
    if (window.defaultRouteName != '/') {
      Application()..initChannel();
      await Application().getLocalInfo();
    } else {
      Application()..isInApp = true;
    }
    runApp(KPLApp(window.defaultRouteName));
  }
  ```
  4. 通过defaultRouteName可以配置初始化的页面


### flutter 集成到ios
  flutter 刚发布的时候集成比较麻烦有两种集成方式，现在已经比较方便主要都用pod集成可以减少耦合
  1. 配置Podfile(需要安装pod, 但是应该大部分项目都已经安装过了)
  ```
  flutter_application_path = "xxx/xxx/my_flutter"  // 根据自己的项目上层级配置
  eval(File.read(File.join(flutter_application_path, '.ios', 'Flutter', 'podhelper.rb')), binding)
  ```
  2. 打开Xcode工程，选择要加入 Flutter App 的 target，选择 Build Phases，点击顶部的 + 号，选择 New Run Script Phase，然后输入以下脚本
  ```
  "$FLUTTER_ROOT/packages/flutter_tools/bin/xcode_backend.sh" build
  "$FLUTTER_ROOT/packages/flutter_tools/bin/xcode_backend.sh" embed
  ```
  3. 执行`pod install`


> ps: 这样其实已经可以了后续介绍的是与flutter 交互相关，但是这里还有别的问题,`相关可以参考`[iOS混合项目优化](https://juejin.im/post/5c3ae5ef518825242165c5ca)

      1. 团队开发时无法保证flutter sdk统一只能规范约定，不能从代码层面约束
      2. 对Native工程无侵入, native打包必须配置flutter环境，并且无法自动同助依赖
      3. 影响Native工程的开发流程与打包流程
      4. 不容易本地调试
  
#### flutter 集成到ios
  大部分情况可以用flutter提供的methodchannel和eventchannel就可以实现，如果有特定需求可以自己实现basechannel

>FlutterMethodChannel flutter主动调iOS代码


    *flutter代码*
    static const _methodChannel = const MethodChannel('kpl-method-scheme');
    
    void goBack2Native() async {
      await _methodChannel.invokeMethod('goBack');
    }
    *iOS代码*

    FlutterMethodChannel *messageChannel = [FlutterMethodChannel methodChannelWithName:methodChannelName binaryMessenger:vc];
    
    [messageChannel setMethodCallHandler:^(FlutterMethodCall * _Nonnull call, FlutterResult  _Nonnull result) {
        // call.method 获取 flutter 给回到的方法名，要匹配到 channelName 对应的多个 发送方法名，一般需要判断区分
        // call.arguments 获取到 flutter 给到的参数，（比如跳转到另一个页面所需要参数）
        // result 是给flutter的回调， 该回调只能使用一次
        NSLog(@"method=%@ \narguments = %@", call.method, call.arguments);
        
        // method和WKWebView里面JS交互很像
        // flutter点击事件执行后在iOS跳转TargetViewController
        // flutter传参给iOS
        if ([call.method isEqualToString:@"goBack"]) {
            [vc.navigationController popViewControllerAnimated:YES];
        }
    }];

>FlutterEventChannel iOS主动调Futter代码


    *flutter代码*
    static const _eventChannel = const EventChannel('kpl-event-scheme');
    
    void initChannel() {
      _eventChannel.receiveBroadcastStream('init').listen(_onEvent, onError: _onError);
    }
    // 回调事件
    void _onEvent(Object event) {}
    // 错误返回
    void _onError(Object error) {}

    *iOS代码*

    FlutterEventChannel *evenChannal = [FlutterEventChannel eventChannelWithName:eventChannelName binaryMessenger:vc];
    // 代理FlutterStreamHandler
    [evenChannal setStreamHandler:self];
    // 遵守`FlutterStreamHandler`协议
    // 这个onListen是Flutter端开始监听这个channel时的回调，第二个参数 EventSink是用来传数据的载体。
    - (FlutterError* _Nullable)onListenWithArguments:(id _Nullable)arguments
                                          eventSink:(FlutterEventSink)events {
        // arguments flutter给native的参数
        // 回调给flutter， 建议使用实例指向，因为该block可以使用多次
        if (events) {
            NSLog(@"#########: %@", arguments);
            self.events = events;
            // events(@"主动传的数据");
        }
        return nil;
    }

    /// flutter不再接收
    - (FlutterError* _Nullable)onCancelWithArguments:(id _Nullable)arguments {
        // arguments flutter给native的参数
        NSLog(@"%@", arguments);
        self.events = nil;
        return nil;
    }


### flutter 集成到android 
`相关可以参考`[Flutter 集成到现有 Android 项目](https://guoshuyu.cn/home/wx/Flutter-14.html)

## 纯flutter开发实战
由于运营的需要，我们需要把一个h5的应用，做成IOS，因为后端接口都是我们前端团队用nodejs写的，且原生团队人力不足，有了前面集成flutter的经验，我们决定使用flutter开发这个纯资讯的APP，目前已经提审。

### 目录结构
    ├── api
    │   ├── api.dart
    │   └── new_utils.dart
    ├── components
    ├── config
    │   ├── application.dart
    │   └── bus_event.dart
    ├── main.dart
    ├── models
    │   ├── base_response_model.dart
    │   ├── base_response_model.g.dart
    ├── page
    │   └── RootPage.dart
    ├── routers
    │   └── router.dart
    ├── styles
    │   ├── gaps.dart
    │   ├── kplcolor.dart
    │   ├── resources.dart
    │   └── textstyles.dart
    └── tool
        ├── common_refresh.dart
        ├── date_util.dart
        ├── preferences.dart
        └── toast.dart

## 总结
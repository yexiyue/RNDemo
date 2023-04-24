## 9.账号密码本demo

### 1.初始化项目

**根据官网进行初始化，然后把.android目录放入androidStudio进行初始化，安装对应的java依赖**

**解决下载慢问题到下面官网找到对应的镜像**

[Maven Repository: Search/Browse/Explore (mvnrepository.com)](https://mvnrepository.com/)

```java
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33

        // We use NDK 23 which has both M1 support and is the side-by-side NDK version from AGP.
        ndkVersion = "23.1.7779620"
    }
    repositories {
        //在这里使用镜像
        maven { url 'https://repo1.maven.org/maven2/' }
        google()
        mavenCentral()
    }
    dependencies {
        classpath('com.android.tools.build:gradle:7.4.0')
        classpath("com.facebook.react:react-native-gradle-plugin")
    }
}

```



### 2.配置名称和图标

![image-20230411083857305](https://yexiyue.github.io/blogs/2023/2023-03-31.assets/image-20230411083857305.png)

在android工程main下res文件夹包含dpi的就是图标文件夹

**注意：应用名称不要用中文，不然启动不了**



### 3.使用svg图片

**安装依赖**

```bash
pnpm add react-native-svg
pnpm add babel-plugin-inline-import -D
```

[说明文档](https://github.com/software-mansion/react-native-svg/blob/main/USAGE.md)

使用pnpm配置

```js
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const MetroSymlinkResolve = require("@rnx-kit/metro-resolver-symlinks");
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolveRequest: MetroSymlinkResolve(),
  },
};

```

**配置babel转换svg**

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins:[
    [
      "babel-plugin-inline-import",
      {
        "extensions": [".svg"]
      }
    ]
  ]
};

```

**使用svg图片**

```tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
//1.导入svg图片的xml信息
import addSvg from '../asserts/add.svg'
import { SvgXml } from "react-native-svg"
export const Home=()=>{
    const renderButton=()=>{
        return <TouchableOpacity>
            {/* 2.传入参数进行使用 */}
            <SvgXml width={20} height={20} xml={addSvg}></SvgXml>
        </TouchableOpacity>
    }
}

```



### 4.组件ref转发

[forwardRef – React (docschina.org)](https://react.docschina.org/reference/react/forwardRef#forwardref)

**`forwardRef(render)`** 

使用forwardRef包裹组件函数，能使其接受ref参数

[useImperativeHandle – React (docschina.org)](https://react.docschina.org/reference/react/useImperativeHandle)

**useImperativeHandle**

`useImperativeHandle` 是 React 中的一个 Hook，它能让你自定义由 [ref](https://react.docschina.org/learn/manipulating-the-dom-with-refs) 暴露出来的句柄。

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

**AddModal.tsx**

```tsx
import { forwardRef, useImperativeHandle, useState } from "react"
import { Modal, StatusBar, StyleSheet, View } from "react-native"

//1.使用forwardRef包裹一下
export type AddRef={
    show:()=>void,
    hide:()=>void,
}
export const AddModal=forwardRef<AddRef>((props,ref)=>{
    const [visible,setVisible]=useState(true)
    const onShow=()=>{
        setVisible(true)
    }
    const onHide=()=>{
        setVisible(false)
    }

    
    //2.暴露返回值给ref
    useImperativeHandle(ref,()=>({
        show:onShow,
        hide:onHide
    }))
    return <Modal  visible={visible} onRequestClose={()=>setVisible(false)} transparent statusBarTranslucent animationType="fade">
        {/* Modal不能直接写样式和内容，所以得嵌套一个view */}
        <View style={styles.box}>

        </View>
    </Modal>
})

const styles=StyleSheet.create({
    box:{
        flex:1,
        backgroundColor:'#00000060'
    }
})
```



### 5.KeyboardAvoidingView

防止键盘挡住视图

```tsx
<Modal
      visible={visible}
      onRequestClose={() => setVisible(false)}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      {/* Modal不能直接写样式和内容，所以得嵌套一个view */}
      <KeyboardAvoidingView 
       {/* 防止键盘挡住视图 */}
      behavior={Platform.OS==='android'?"height":"padding"}
      style={styles.box}>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.text}>添加账号</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              activeOpacity={0.5}
              onPress={onHide}
            >
              <SvgXml xml={CloseSvg} width={24} height={24}></SvgXml>
            </TouchableOpacity>
            <Text style={[styles.marginTop]}>账号类型</Text>
            {renderType()}
            <Text style={[styles.marginTop]}>账号名称</Text>
            {renderName()}
            <Text style={[styles.marginTop]}>账号</Text>
            {renderAccount()}
            <Text style={[styles.marginTop]}>密码</Text>
            {renderPassword()}
            {renderButton()}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
```



### 6.保存数据

生成id

[react-native-get-random-values - npm (npmjs.com)](https://www.npmjs.com/package/react-native-get-random-values)

[uuid - npm (npmjs.com)](https://www.npmjs.com/package/uuid)

```typescript
import 'react-native-get-random-values'
import {v4} from 'uuid'

export const getUUID=()=>{
    return v4()
}
```

本地数据存储

[@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)

**用法跟localstorage差不多**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

export async function saveData(key:string,value:any){
    try {
        if(typeof value!='string'){
            value=JSON.stringify(value)
        }
        return await AsyncStorage.setItem(key,value)
    } catch (error) {
        console.log(error)
    }
}

export async function getData(key:string) {
    try {
        return await AsyncStorage.getItem(key)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteData(key:string) {
    try {
        return await AsyncStorage.removeItem(key)
    } catch (error) {
        console.log(error)
    }
}
```



### 7.打包发布

[打包发布 · React Native 中文网](https://reactnative.cn/docs/signed-apk-android)

1. 创建应用签名（使用android studio）
2. 编写打包脚本（使用android studio）
3. 打release包并安装发布（使用终端命令 ./gradlew assembleRelease）



![image-20230421210327504](https://yexiyue.github.io/blogs/2023/2023-03-31.assets/image-20230421210327504.png)

在build选项里选择生成签名

然后在android工程下按F4

![image-20230421211004876](https://yexiyue.github.io/blogs/2023/2023-03-31.assets/image-20230421211004876.png)

**新增加release**



然后回到vscode

![image-20230422102226790](https://yexiyue.github.io/blogs/2023/2023-03-31.assets/image-20230422102226790.png)

在安卓工程下执行该命令，即可打包好

```bash
./gradlew assembleRelease
```



然后使用rn进行测试

```bash
pnpm android --mode=release
```



最后打包生成的apk在安卓工程下output文件夹里

![image-20230422102437378](https://yexiyue.github.io/blogs/2023/2023-03-31.assets/image-20230422102437378.png)

import { Alert, Animated, LayoutAnimation, SectionList, SectionListProps, SectionListRenderItemInfo, StyleSheet, Switch, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import addSvg1 from "../asserts/add.svg";
import { SvgXml } from "react-native-svg";
import { AddModal, AddRef } from "../components/AddModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { getData, saveData } from "../utils/storage";
import game from '../asserts/game.svg'
import friend from '../asserts/friend.svg'
import plat from '../asserts/platform.svg'
import other from '../asserts/other.svg'
import arrowRight from '../asserts/arraw_right.svg'
import arrowBottom from '../asserts/arraw_bottom.svg' 
import empty from '../asserts/empty.svg'
const iconMap:any={
  '游戏':game,
  '社交':friend,
  '平台':plat,
  '其他':other
}

export const Home = () => {

  const addRef = useRef<AddRef>(null);
  
  const [showPassword,setShowPassword]=useState(false)
  const renderTitle = () => {
    const titleStyle = StyleSheet.create({
      title: {
        height: 46,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        flexDirection:'row'
      },
      txt: {
        fontSize: 18, //标题一般都是18
        color: "#333333",
        fontWeight: "bold",
      },
      switch:{
        position:'absolute',
        right:20
      }
    });
    return (
      <View style={titleStyle.title}>
        <Text style={titleStyle.txt}>账号管理</Text>
        <Switch style={titleStyle.switch} value={showPassword}
          onValueChange={(value)=>setShowPassword(value)}
        ></Switch>
      </View>
    );
  };

  const renderButton = () => {
    const btnStyles = StyleSheet.create({
      button: {
        width: 50,
        height: 50,
        position: "absolute",
        right: 30,
        bottom: 64,
        zIndex:999
      },
    });
    return (
      <TouchableOpacity
        style={btnStyles.button}
        onPress={() => {
          addRef.current?.show()
        }}
        activeOpacity={0.5}
      >
        <SvgXml width="100%" height="100%" xml={addSvg1}></SvgXml>
      </TouchableOpacity>
    );
  };


  //读取数据
  const [accountList,setAccountList]=useState<Account[]>([])

  useEffect(()=>{
    getData('accounts').then(res=>{
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setAccountList(res ?? [])
    })
  },[])
  
  const sectionList=useMemo(()=>{
    const mapList=accountList.reduce((pre,cur)=>{
      if(Array.isArray(pre[cur.type])){
        pre[cur.type].push(cur)
      }else{
        pre[cur.type]=[]
        pre[cur.type].push(cur)
      }
      return pre
    },{} as any)
    let res:{
      type:string,
      data:Account[]
    }[]=[]
    for(let i in mapList){
      let obj={
        type:i,
        data:mapList[i]
      }
      res.push(obj)
    }
    return res
  },[accountList])

  //定义收起的数据
  const [sectionState,setSectionState]=useState<any>({
    '游戏':true,
    '社交':true,
    '平台':true,
    '其他':true
  })


  const deleteAccount=async (account:Account)=>{
    let list=await getData('accounts')
    list=list?.filter(item=>item.id!==account.id)
    await saveData('accounts',list)
    list=await getData('accounts')
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setAccountList(list!)
  }

  const renderItem:SectionListProps<Account>['renderItem']=({item})=>{
    if(!sectionState[item.type]){
      return null
    }
    
    const styles=StyleSheet.create({
      itemStyle:{
        paddingHorizontal:20,
        backgroundColor:'white',
        paddingVertical:10,
        borderTopColor:'#ccc',
        borderTopWidth:1
      },
      content:{
        flexDirection:'row',
        alignItems:'center',
        marginTop:5
      },
      textStyle:{
        width:'50%',
        color:'#aaa'
      },
      nameStyle:{
        fontSize:16,
        color:'#333'
      }
    })
    return <TouchableOpacity 
    style={styles.itemStyle}
    onPress={()=>{
      addRef.current?.show(item)
    }}
    onLongPress={()=>{
      addRef.current?.hide()
      Alert.alert('提示',`确定要删除名称为: "${item.name}" 的账号吗?`,[
        {
          text:'取消',
          onPress:()=>{}
        },
        {
          text:'确定',
          onPress:()=>{
            deleteAccount(item)
          }
        }
      ],{
        cancelable:true,
      })
    }}
    >
      <Text style={styles.nameStyle}>{item.name}</Text>
      <View style={styles.content}>
        <Text style={styles.textStyle}>账号：{item.account}</Text>
        <Text style={styles.textStyle} >密码：{showPassword? item.password:'********'}</Text>
      </View>
    </TouchableOpacity>
  }



  const renderSectionHeader:SectionListProps<Account>['renderSectionHeader']=({section})=>{
    const styles=StyleSheet.create({
      header:{
        width:'100%',
        backgroundColor:'white',
        height:46,
        borderTopLeftRadius:12,
        borderTopRightRadius:12,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:12,
        marginTop:12,
      },
      textStyle:{
        fontSize:16,
        color:'#333',
        fontWeight:'bold',
        marginLeft:16
      },
      arrow:{
        position:'absolute',
        right:0,
        padding:16
      }
    })
    return <View style={[styles.header,section.data.length<=0 || !sectionState[section.type] ?{
      borderBottomLeftRadius:12,
      borderBottomRightRadius:12
    }:null]}>
      <SvgXml width={30} height={30} xml={iconMap[section.type]}></SvgXml>
      <Text style={styles.textStyle}>{section.type}</Text>
      <TouchableOpacity activeOpacity={0.8} style={[styles.arrow,{
        transform:[
          {
            rotate:sectionState[section.type]?'0deg':'-90deg'
          }
        ]
      }]} onPress={()=>{
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setSectionState((preValue: any)=>({...preValue,[section.type]:!preValue[section.type]}))
      }}>
        <SvgXml width={20} height={20} xml={arrowBottom}></SvgXml>
      </TouchableOpacity>
    </View>
  }

  const renderEmpty=()=>{
    const height=useWindowDimensions().height
    const styles=StyleSheet.create({
      empty:{
        width:'100%',
        height:height-70,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
      }
    })
    return <View style={styles.empty}>
      <SvgXml width={200} height={200} xml={empty}></SvgXml>
    </View>
  }
  return (
    <View style={styles.home}>
      {renderTitle()}
      {renderButton()}
      <AddModal onSaveData={()=>{
        getData('accounts').then(res=>{
          setAccountList(res ?? [])
        })
      }} ref={addRef}></AddModal>

      {/* 分组列表 */}
      <SectionList 
      sections={sectionList} 
      keyExtractor={(item)=>item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      contentContainerStyle={styles.contentStyle}
      ListEmptyComponent={renderEmpty()}
      >

      </SectionList>
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    position: "relative",
    flex: 1,
  },
  contentStyle:{
    paddingHorizontal:10
  }
});

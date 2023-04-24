import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
} from "react-native";
import CloseSvg from "../asserts/close.svg";
import { SvgXml } from "react-native-svg";
import { getUUID } from "../utils/uuid";
import { getData, saveData } from "../utils/storage";

//1.使用forwardRef包裹一下
export type AddRef = {
  show: (item?:Account) => void;
  hide: () => void;
};

export const AddModal = forwardRef<AddRef,{
  onSaveData:()=>void
}>((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("游戏");
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [id,setId]=useState(getUUID())


  const [modify,setModify]=useState(false)
  
  
  const onShow = (item?:Account) => {
    //如果携带参数表示修改
    if(item){
      setType(item.type)
      setName(item.name)
      setAccount(item.account)
      setPassword(item.password)
      setId(item.id)
      setModify(true)
    }else{
      setId(getUUID())
      setType('游戏')
      setName('')
      setAccount('')
      setPassword('')
      setModify(false)
    }
    
    setVisible(true);
  };
  const onHide = () => {
    setVisible(false);
  };

  //保存数据
  const onSaveHandle=async()=>{

    let accountList=(await getData('accounts'))??[]
    const newAccount={
      id,
      type,
      name,
      account,
      password
    }
    let ifExist=accountList.findIndex(item=>item.id===newAccount.id)
    //如果存在表示修改，不存在表示添加
    if(ifExist==-1){
      accountList.push(newAccount)
    }else{
      accountList.splice(ifExist,1,newAccount)
    }

    saveData('accounts',accountList).then(()=>{
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      //调用回调函数更新父组件数据
      props.onSaveData()
      onHide()
    })
  }
  //2.暴露返回值给ref
  useImperativeHandle(ref, () => ({
    show: onShow,
    hide: onHide,
  }));

  const renderType = () => {
    const typeStyles = StyleSheet.create({
      typesLayout: {
        flexDirection: "row",
      },
      itemStyle: {
        width: "25%",
        alignItems: "center",
        justifyContent: "center",
        height: 36,
        borderWidth: 1,
        borderColor: "#aaa",
      },
      /* 让边框叠加的地方重叠起来 */
      marginLeft: {
        marginLeft: -1,
      },
      /* 给最左边设置圆角 */
      borderLeft: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
      },
      /* 给最右边设置圆角 */
      borderRight: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
      },
      text: {
        color: "#000",
      },
      choose: {
        color: "white",
      },
    });
    const data = ["游戏", "平台", "社交", "其他"];
    return (
      <View style={[typeStyles.typesLayout, styles.marginTop]}>
        {data.map((item, index) => (
          <TouchableOpacity
            style={[
              typeStyles.itemStyle,
              index > 0 ? typeStyles.marginLeft : {},
              index === 0
                ? typeStyles.borderLeft
                : index === 3
                ? typeStyles.borderRight
                : {},
              type === item ? { backgroundColor: "#1296db" } : {},
            ]}
            key={item}
            onPress={() => setType(item)}
            activeOpacity={0.5}
          >
            <Text
              style={[typeStyles.text, type === item ? typeStyles.choose : {}]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderName = () => {
    const styles = StyleSheet.create({
      input: {
        backgroundColor: "#f0f0f0",
        height: 40,
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
      },
    });
    return (
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        cursorColor="#1296db"
        selectTextOnFocus
        selectionColor="#1296db"
      ></TextInput>
    );
  };

  const renderAccount=() => {
    const styles = StyleSheet.create({
      input: {
        backgroundColor: "#f0f0f0",
        height: 40,
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
      },
    });
    return (
      <TextInput
        style={styles.input}
        value={account}
        onChangeText={(text) => setAccount(text)}
        cursorColor="#1296db"
        selectTextOnFocus
        selectionColor="#1296db"
      ></TextInput>
    );
  };

  const renderPassword=() => {
    const styles = StyleSheet.create({
      input: {
        backgroundColor: "#f0f0f0",
        height: 40,
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 14,
      },
    });
    return (
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        cursorColor="#1296db"
        selectTextOnFocus
        selectionColor="#1296db"
      ></TextInput>
    );
  };

  const renderButton=()=>{
    return <TouchableOpacity 
            style={{
                backgroundColor:'#1296db',
                height:36,
                marginTop:16,
                marginBottom:10,
                borderRadius:8,
                justifyContent:'center',
                alignItems:'center'
            }}
            activeOpacity={0.7}
            onPress={onSaveHandle}
        >
        <Text style={{
            color:'white',
            fontSize:16,
            fontWeight:'bold'
        }}>{modify?'修改':'保存'}</Text>
    </TouchableOpacity>
  }
  return (
    <Modal
      visible={visible}
      onRequestClose={() => setVisible(false)}
      transparent
      statusBarTranslucent
      animationType="fade"
    >
      {/* Modal不能直接写样式和内容，所以得嵌套一个view */}
      <KeyboardAvoidingView 
      behavior={Platform.OS==='android'?"height":"padding"}
      style={styles.box}>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text style={styles.text}>{modify?'修改':'添加'}账号</Text>
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
  );
});

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#00000060",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
  },
  text: {
    textAlign: "center",
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    right: 0,
  },
  marginTop: {
    marginTop: 8,
    color: "#333",
    fontSize: 14,
    marginBottom: 5,
  },
});

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { Home } from './src/modules/Home';

export default function App():JSX.Element{
  return <SafeAreaView style={styles.root}>
    <StatusBar barStyle="dark-content" backgroundColor="white"></StatusBar>
    <Home></Home>
  </SafeAreaView>
}

const styles=StyleSheet.create({
  root:{
    width:"100%",
    height:"100%",
    backgroundColor:"#f0f0f0"
  },
})
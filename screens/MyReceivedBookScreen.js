import React,{Component} from 'react';
import {View,Text,TouchableOpacity,FlatList,StyleSheet} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader';
import {RFValue} from 'react-native-responsive-fontsize'

export default class MyReceivedBookScreen extends React.Component{
   constructor(){
       super();
       this.state={
           userId: firebase.auth().currentUser.email,
           receivedBooksList: [],
       }
       this.requestRef = null
   }
   componentDidMount(){
       getReceivedBooksList();
   }
   componentWillUnmount(){
       this.requestRef();
   }
   getReceivedBooksList=()=>{
      this.requestRef = db.collection("requested_books").where("user_id","==",this.state.userId).where("book_status","==","received")
      .onSnapshot((snapshot)=>{
          var receivedBooksList = snapshot.docs.map("doc",doc.data())
          this.setState({
              receivedBooksList: receivedBooksList
          })
      })
   }
   
   keyExtractor=(item,index)=>index.toString();
   renderItem=({item,i})=>{
     return(
         <ListItem
          key={i}
          title={item.book_name}
          subtitle={item.bookStatus}
          titleStyle={{fontColour: 'black',fontWeight: 'bold'}}
          bottomDivider
         />
     )     
   }
    render(){
      return(
          <View style={{flex:1}}>
          <MyHeader title="Received Books" navigation={this.props.navigation}/>
          <View style={{flex: 1}}>
              {this.state.receivedBooksList.length===0
               ?(
                 <View style={styles.subContainer}>
                     <Text>List Of All Received Books</Text>
                 </View>
                ):(
                   <FlatList
                     keyExtractor={this.keyExtractor}
                     data={this.state.receivedBooksList}
                     renderItem={this.renderItem}
                   /> 
                )
              }
          </View>
          </View>
      )
  }
}

const styles = StyleSheet.create({
    subContainer:{
      flex:1,
      fontSize: 20,
      justifyContent:'center',
      alignItems:'center'
    },
    button:{
      width:100,
      height:30,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:"#ff5722",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8
       }
    }
  })
import React from 'react';
import {View,Text,StyleSheet} from 'react-native'
import firebase from 'firebase'
import db from '../config'
import { Card, Header } from 'react-native-elements';
import { color } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-responsive-fontsize'

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
     super(props)
     this.state={
       userId: firebase.auth().currentUser.email,  
       userName: '',
       receiverId: this.props.navigation.getParam('details')["user_id"],
       requestId:  this.props.navigation.getParam('details')["request_id"],
       bookName:   this.props.navigation.getParam('details')["book_name"],
       reason_for_requesting: this.props.navigation.getParam('details')["reason_to_request"],
       receiverName: '',
       receiverContact:'',
       receiverAddress:'',
       receiverRequestDocId:'' 
    }
  }
  componentDidMount(){
    this.getReceiverDetails();
  }
  addNotification=()=>{
     var message = this.state.userName+"has shown interest in donating the book!"
     db.collection("All_notifications").add({
         "targetedUser_Id": this.state.receiverId,
         "donor_Id": this.state.userId,
         "request_id": this.state.requestId,
         "book_name": this.state.bookName,
         "date": firebase.firestore.FieldValue.serverTimestamp()
     })  
  }
  
  getReceiverDetails=()=>{
    db.collection("users").where("email_id","==",this.state.receiverId).get()
    .then((snapshot)=>{
        snapshot.forEach(doc=>{
            this.setState({
                receiverName: doc.data().first_name,
                receiverContact: doc.data().contact,
                receiverAddress: doc.data().address,
            })
        })
    })
     db.collection('requested_books').where("request_id",""=="",this.state.requestId).get()
     .then((snapshot)=>{
        snapshot.forEach(doc=>{
            this.setState({
                receiverRequestDocId: doc.id
            })
        })
     })
  }
  updateBookStatus=()=>{
      db.collection("all_donations").add({
          book_name: this.state.bookName,
          request_id: this.state.requestId,
          requested_by: this.state.receiverName,
          donor_id: this.state.userId,
          request_status: "Donor Interested!"
      })
  }
    render(){
        return(
         <View style={styles.containner}>
            <View  style={{flex: 0.1}}>
                <Header 
                 leftComponent={<Icon name='arrow-left' type='feather' color='#696969' 
                 onPress={()=>this.props.navigation.goBack()}/>}
                 centerComponent={{text: "DonateBooks", style: {color:'#90a5a9',fontSize: RFValue(20),fontWeight: 'bold'}}}
                 backgroundColor="#eaf8fe"
                 />
            </View>
            <View style={{flex: 0.9}}>
                <View style={{flex: 0.3,flexDirection: "row",paddingTop:RFValue(30)}}></View>
                <Card title={"Book Information"} titleStyle= {{fontSize: 20}}>
                    <Card ><Text style={{fontWeight: "bold"}}>Name:{ this.bookName}</Text></Card>
                    <Card><Text style={{fontWeight: "bold"}}> Reason:{this.state.reason_for_requesting}</Text></Card>
                </Card>
            </View>
            <View style={{flex: 0.3}}>
                <Card title={"Receiver Information"} titleStyle={{fontSize: 20}}>
                <Card><Text style={{fontWeight: "bold"}}>Name: {this.state.receiverName}</Text></Card>
                <Card><Text> Contact: {this.state.receiverContact}</Text></Card>
               <Card><Text> Address:{this.state.receiverAddress}</Text></Card>
                </Card>
            </View>
            <View>
                {this.state.requestId!==this.state.userId
                ?(
                <TouchableOpacity  style={styles.button} onPress={()=>{
                    this.updateBookStatus()
                    this.addNotification()
                    this.props.navigation.navigate('My Donations')}
                   }>
                       <Text>I want to donate</Text>
                       </TouchableOpacity>
                ): null    
            }
            </View>
            <View>

            </View>
         </View>
       )
    }
}
 
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    buttonContainer: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
      width: "75%",
      height: RFValue(60),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: RFValue(60),
      backgroundColor: "#ff5722",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 16,
    },
  })
  
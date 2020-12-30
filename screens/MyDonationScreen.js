import React,{Component} from 'react';
import {View,Text,FlatList,StyleSheet} from 'react-native';
import db from '../config';
import {ListItem} from 'react-native-elements';
import { color } from 'react-native-reanimated';
import MyHeader from '../components/MyHeader'
import {RFValue} from 'react-native-responsive-fontsize'

export default class MyDonationScreen extends Component{
    constructor(){
       super();
       this.state={
         userId : firebase.auth().currentUser.email,
         allDonations: []     
       } 
    }
    componentDidMount(){
        this.getAllDonations();
    }
    getAllDonations=()=>{
      this.requestRef = db.collection("all_Donations").where("donor_Id","==",this.state.userId)
      .onSnapshot((snapshot)=>{
        var allDonations = snapshot.docs.map(document=>document.data())
        this.setState({
          allDonations: allDonations   
        })  
      })   
    }
    sendNotifications=(bookDetails,request_status)=>{
      var requestId = bookDetails.request_Id
      var donorId = bookDetails.donor_Id
      db.collection("all_Notifications").
      where("request_Id","==",requestId).
      where("donor_Id","==",donorId).
      get()
      .then((snapshot)=>{
         var message = ""
         if(request_status==="Book Sent"){
             message=this.state.donorName+"Sent You A Book"
         } 
         else{
            message=this.state.donorName+"Has Shown Interest In donating A book" 
         }
         db.collection("all_Notifications").doc(doc.id).update({
              "message": message,
              "notification_status": "unread",
              "date:": firebase.firestore.FieldValue.serverTimestamp()
         })
      })
    
    }
    sendBook=(bookDetails)=>{
      if(bookDetails.request_status==="Book Sent"){
          var requestStatus = "Donor Interested"
          db.collection("all_donations").doc(bookDetails.doc_id).update({
            "request_status" : "Donor Interested" 
          })
          this.sendNotifications(bookDetails,requestStatus)     
      }
      else{
        var requestStatus = "Book Sent"
        db.collection("all_donations").doc(bookDetails.doc_id).update({
          "request_status" : "Book Sent" 
        })
        this.sendNotifications(bookDetails,requestStatus)     
    }
    } 
    keyExtractor=(item,index)=>index.toString();
    renderItem=({item,i})=>(
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={"requested_by:" + item.requested_by+"/n status:"+item.request_status}
        leftElement={<Icon name="book" type="font-awesome" color="#696969"/>}
        titleStyle={{color: "black", fontWeight: 'bold'}}
        rightElement={
        <TouchableOpacity style={styles.button} onPress={()=>{this.sendBook(item)}}>
        <Text style={{color: '#fff'}}>Send Book</Text>
            </TouchableOpacity>}
            bottomDivider
      />
    )
    render(){
        return(
            <View style={{flex: 1}}>
               <MyHeader navigation={this.props.navigation} title="My Donations"/>
               <View style={{flex: 1}}>
                 {this.state.allDonations.length===0
                 ?(
                   <View style={styles.subtitle}>
                      <Text style={{fontSize: 20}}>List Of All Donations</Text> 
                     
                   </View>  
                 )
                 :(
                    <FlatList
                    keyExtractor={this.keyExtractor}
                    data={this.state.allDonations}
                    renderItem={this.renderItem()}
                    /> 
                 )
                 }
                </View>                           
            </View>
        )
    }
}

const styles = StyleSheet.create({ 
    button:{ width:100, height:30, justifyContent:'center', alignItems:'center', shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, elevation : 16 }, 
    subtitle :{ flex:1, fontSize: 20, justifyContent:'center', alignItems:'center' } })

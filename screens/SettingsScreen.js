import React,{Component} from 'react';
import {View,Text,TextInput, Alert,StyleSheet} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MyHeader from '../components/MyHeader'
import firebase from 'firebase';
import db from '../config'
import {RFValue} from 'react-native-responsive-fontsize'

export default class SettingsScreen extends Component{
    constructor(){
        super();
        this.state={
           firstName: '',
           lastName: '',
           contact: '',
           address: '',
           docId: '',
           emailId: ''
        }
    }
    componentDidMount(){
        this.getUserDetails();
    }
    getUserDetails=()=>{
        var user= firebase.auth().currentUser;
        var email = user.email
        db.collection("users").where("email_Id","==",email).get()
        .then((snapshot)=>{
          snapshot.forEach(doc=>{
              var data = doc.data();
              this.setState({
                 emailId: email_Id ,
                 firstName: first_name,
                 lastName: last_name,
                 contact: contact,
                 address: address,
                 docId: doc.id
              })
          })
        })
    }
    updateUserDetails=()=>{
       db.collection('users').doc(this.state.docId).update({
         "first_name": this.state.firstName,
         "last_name": this.state.lastName,
         "address": this.state.address,
         "contact": this.state.contact  
       })
       Alert.alert('Profile Updated Successfully!') 
    }
    render(){
        return(
            <View style={StyleSheet.container}>
             <MyHeader title="setting" navigation={this.props.navigation}/>
              <View style={styles.formContainer}>
                  <Text style={styles.formTextInput}>First Name</Text>
                  <TextInput
                   style={styles.formTextInput}
                   placeholder={"First Name"}
                   maxLength={8}
                   onChangeText={(text)=>{
                     this.setState({
                       firstName: text    
                     })
                   }}
                   value={this.state.firstName}
                  
                  />
                <Text style={styles.formTextInput}>Last Name</Text>
                  <TextInput
                   style={styles.formTextInput}
                   placeholder={"Last Name"}
                   maxLength={12}
                   onChangeText={(text)=>{
                    this.setState({
                        lastName: text
                    })
                   }}
                  value={this.state.lastName}
                  />
                <Text style={styles.formTextInput}>Contact</Text>  
                  <TextInput
                   style={styles.formTextInput}
                   placeholder={"Contact"}
                   maxLength={10}
                   keyboardType={"numeric"}
                   onChangeText={(text)=>{
                       this.setState({
                          contact: text 
                       })
                   }}
                   value={this.state.contact}
                  />
                <Text style={styles.formTextInput}>Address</Text>       
                  <TextInput
                   style={styles.formTextInput}
                   placeholder={"Address"}
                   multiline={true}
                   onChangeText={(text)=>{
                    this.setState({
                      address: text
                    })
                   }}
                   value={this.state.address}
                  />
                  <TouchableOpacity style={styles.button} onPress={()=>{this.updateUserDetails}}>
                      <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
              </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor:"#6fc0b8" }, formContainer:{ flex: 0.88, justifyContent:'center' }, label:{ fontSize:RFValue(18), color:"#717D7E", fontWeight:'bold', padding:RFValue(10), marginLeft:RFValue(20) }, formTextInput: { width: "90%", height: RFValue(50), padding: RFValue(10), borderWidth:1, borderRadius:2, borderColor:"grey", marginBottom:RFValue(20), marginLeft:RFValue(20) }, 
button: { width: "75%", height: RFValue(60), justifyContent: "center", alignItems: "center", borderRadius: RFValue(50), backgroundColor: "#32867d", shadowColor: "#000", shadowOffset: { width: 0, height: 8, }, shadowOpacity: 0.44, shadowRadius: 10.32, elevation: 16, marginTop: RFValue(20), },
buttonView:{ flex: 0.22, alignItems: "center", marginTop:RFValue(100) }, buttonText: { fontSize: RFValue(23), fontWeight: "bold", color: "#fff", }, });
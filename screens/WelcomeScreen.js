import React,{Component}from 'react';
import {View,Text,TextInput,Modal,KeyboardAvoidingView,StyleSheet,TouchableOpacity,Alert,ScrollView} from 'react-native';

import SantaAnimation from '../components/SantaClaus.js';
import db from '../config';
import firebase from 'firebase';
import {RFValue} from 'react-native-responsive-fontsize'


export default class WelcomeScreen extends Component{
  constructor(){
    super();
    this.state={
      emailId:'',
      password:'',
      firstName:'',
      lastName:'',
      address:'',
      contact:'',
      confirmPassword:'',
      isModalVisible:'false'
    }
  }

  userSignUp = (emailId, password,confirmPassword) =>{
   if(password !== confirmPassword){
       return Alert.alert("password doesn't match\nCheck your password.")
   }else{
     firebase.auth().createUserWithEmailAndPassword(emailId, password)
     .then(()=>{
       db.collection('users').add({
         first_name:this.state.firstName,
         last_name:this.state.lastName,
         contact:this.state.contact,
         email_id:this.state.emailId,
         address:this.state.address,
         isBookRequestActive: false
        })
       return  Alert.alert(
            'User Added Successfully',
            '',
            [
              {text: 'OK', onPress: () => this.setState({"isModalVisible" : false})},
            ]
        );
     })
     .catch((error)=> {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       return Alert.alert(errorMessage)
     });
   }
 }

userLogin = (emailId, password)=>{
   firebase.auth().signInWithEmailAndPassword(emailId, password)
   .then(()=>{
     this.props.navigation.navigate('DonateBooks')
   })
   .catch((error)=> {
     var errorCode = error.code;
     var errorMessage = error.message;
     return Alert.alert(errorMessage)
   })
 }

showModal = () =>{
  return(
  <Modal
    animationType="slide"
    transparent={true}
    visible={this.state.isModalVisible}
    >
      
      <ScrollView style={{width:'100%'}}>
      <View style={styles.signupView}>
       <Text style={styles.signupText}>Sign Up</Text>
      </View>
       <View style={{flex: 0.95}}>
        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
        <Text
          style={{fontSize: RFValue(20) ,fontWeight: 'bold', color: '#32867d'}}
          >Sign Up</Text>
        <Text style={styles.label}>First Name</Text>     
        <TextInput
          style={styles.formTextInput}
          placeholder ={"First Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              firstName: text
            })
          }}
        />
                <Text style={styles.label}>Last Name</Text>     
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Last Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              lastName: text
            })
          }}
        />
        <Text style={styles.label}>Contact</Text>     
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Contact"}
          maxLength ={10}
          keyboardType={'numeric'}
          onChangeText={(text)=>{
            this.setState({
              contact: text
            })
          }}
        />
        <Text style={styles.label}>Address</Text>     
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Address"}
          multiline = {true}
          onChangeText={(text)=>{
            this.setState({
              address: text
            })
          }}
        />
                <Text style={styles.label}>Email-Address</Text>     
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Email"}
          keyboardType ={'email-address'}
          onChangeText={(text)=>{
            this.setState({
              emailId: text
            })
          }}
        />
        <Text style={styles.label}>Password</Text>             
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Password"}
          secureTextEntry = {true}
          onChangeText={(text)=>{
            this.setState({
              password: text
            })
          }}
        />
        <Text style={styles.label}>Confirm Password</Text>     
        
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Confrim Password"}
          secureTextEntry = {true}
          onChangeText={(text)=>{
            this.setState({
              confirmPassword: text
            })
          }}
        />
        <View style={styles.modalBackButton}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={()=>
              this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)
            }
          >
          <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modalBackButton}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={()=>this.setState({"isModalVisible":false})}
          >
          <Text style={{color:'#ff5722'}}>Cancel</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </View>
      </ScrollView>
    
  </Modal>
)
}
  render(){
    return(
      <View style={styles.container}>
        <View style={{justifyContent: 'center',alignItems: 'center'}}>

        </View>
          {
            this.showModal()
          }
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text style={styles.title}>Book Santa</Text>
        </View>
        <View>
          <Text style={styles.label}>Email-Address</Text>
            <TextInput
            style={styles.loginBox}
            placeholder="abc@example.com"
            keyboardType ='email-address'
            onChangeText={(text)=>{
              this.setState({
                emailId: text
              })
            }}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
          style={styles.loginBox}
          secureTextEntry = {true}
          placeholder="enter Password"
          onChangeText={(text)=>{
            this.setState({
              password: text
            })
          }}
        />
        <TouchableOpacity
           style={[styles.button,{marginBottom:20, marginTop:20}]}
           onPress = {()=>{
             this.userLogin(this.state.emailId, this.state.password)
           }}
           >
           <Text style={styles.buttonText}>Login</Text>
         </TouchableOpacity>

         <TouchableOpacity
           style={styles.button}
           onPress={()=>this.setState({ isModalVisible:true})}
           >
           <Text style={styles.buttonText}>SignUp</Text>
         </TouchableOpacity>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6fc0b8",
  },
  loginBox: {
    width: "80%",
    height: RFValue(50),
    borderWidth: 1.5,
    borderColor: "#ffffff",
    fontSize: RFValue(20),
    paddingLeft: RFValue(10),
  },
  button: {
    width: "80%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "#ffff",
    shadowColor: "#000",
    marginBottom:RFValue(10),
  },  formInput: {
      width: "90%",
      height: RFValue(45),
      padding: RFValue(10),
      borderWidth:1,
      borderRadius:2,
      borderColor:"grey",
      paddingBottom:RFValue(10),
      marginLeft:RFValue(20),
      marginBottom:RFValue(14)
    },
    registerButtonText: {
      fontSize: RFValue(23),
      fontWeight: "bold",
      color: "#fff",
    },
    cancelButtonText:{
      fontSize : RFValue(20),
      fontWeight:'bold',
      color: "#32867d",
      marginTop:RFValue(10)
    },
    scrollview:{
      flex: 1,
      backgroundColor: "#fff"
    },
    signupView:{
      flex:0.05,
      justifyContent:'center',
      alignItems:'center'
  },
  signupText:{
    fontSize:RFValue(20),
    fontWeight:"bold",
    color:"#32867d"
  },santaImage:{
    width:"70%",
    height:"100%",
    resizeMode:"stretch"
  },
  TextInput:{
    flex:0.5,
    alignItems:"center",
    justifyContent:"center"
  },
  bookImage:{
    width:"100%",
    height:RFValue(220)
  }
  });
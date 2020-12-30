import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'
import {Avatar, Icon} from 'react-native-elements'
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import db from '../config'
import {RFValue} from 'react-native-responsive-fontsize'

export default class CustomSideBarMenu extends Component{
  state={
    userId: firebase.auth().currentUser.email,
    image: "#",
    name: "",
    docId: ""
  }
  
  selectPicture=async()=>{
    const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ImagePicker.MediaTypesOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality:1
    })
    if(!cancelled){
        this.uploadImage(uri,this.state.userId)
    }
  }

  uploadImage=async(uri,imageName)=>{
    var response = await fetch(uri);
    var blob = await response.blob();
    var ref = firebase.storage().ref().child("user_profiles/"+imageName);
    return ref.put(blob.then((response)=>{this.fetchImage(imageName)}));     
  }
  getUserProfile=()=>{
    db.collection('users').where("email_id","==",this.state.userId)
    .onSnapshot((querySnapshot)=>{
        querySnapshot.forEach((doc)=>{
          this.setState({
           name: doc.data().first_name+" "+doc.data().last_name
          })
        })
    })
  }
  fetchImage=(imageName)=>{
    var storageRef = firebase.storage().ref().child("user_profile/"+imageName);
    storageRef
    .getDownloadURL().then((url)=>{
      this.setState({
        image: url
      })
    })
    .catch((error)=>{
      this.setState({
        image: "#"
      })
    })

  }
  componentDidMount(){
    this.fetchImage();
    this.getUserProfile();
  }

  render(){
    return(
      <View style={{flex:1}}>
        <View style={{flex: 0.1, backgroundColor: '#32867d',alignItems: 'center'}}>
          <Avatar
            rounded
            source={{uri:this.state.image,}}
            size="medium"
            onPress={()=>this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />
          <Text style={{fontWeight: "100", fontSize: RFValue(20), padding: RFValue(10)}}>{this.state.name}</Text>
        </View>
        <View style={styles.drawerItemsContainer}>
          <DrawerItems {...this.props}/>
        </View>
        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}
               
         onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}
          >
            <Icon
              name="Log Out"
              type="ant-design"
              size={RFValue(20)}
              iconStyle={{paddingLeft: RFValue(10)}}
            />
            <Text style={{fontSize: RFValue(20),fontWeight: 'bold', marginLeft: RFValue(30)}}>Log Out</Text>
          </TouchableOpacity>
        
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({ 
  container: { flex: 1, }, drawerItemsContainer: { flex: 0.8, }, 
  logOutContainer: { flex: 0.2, justifyContent: "flex-end", paddingBottom: 30, }, 
  logOutButton: { height: 30, width: "100%", justifyContent: "center", padding: 10, }, 
  imageContainer: { flex: 0.75, width: "40%", height: "20%", marginLeft: 20, marginTop: 30, borderRadius: 40, }, 
  logOutText: { fontSize: 30, fontWeight: "bold", }
 });
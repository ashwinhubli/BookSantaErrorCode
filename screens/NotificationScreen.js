import React from 'react';
import {View,Text,StyleSheet} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import firebase from 'firebase'
import db from '../config'
import {Icon, ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader'
import {SwipableFlatlist} from '../components/SwipableFlatlist';
import {RFValue} from 'react-native-responsive-fontsize'

export default class NotificationScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
          userId: firebase.auth().currentUser.email,
          allNotifications: []
        }
        this.notificationRef = null;
    }
    componentDidMount(){
        this.getNotifications();
    }
    componentWillUnmount(){
        this.notificationRef();
    }

    getNotifications=()=>{
      this.requestRef = db.collection("all_noifications").
      where("notification_status","==","unread").
      where("targeted_user_Id","==",this.state.userId).
      onSnapshot((snapshot)=>{
          var allNotifications = []
          snapshot.docs.map((doc)=>{
           var notification = doc.data();
           notification["doc_id"]=doc.id
           allNotifications.push(notification)
          })
          this.setState({
              allNotifications: allNotifications
          })
      })
    }
    
    keyExtractor=(index,item)=>index.toString();
     renderItem=({item,i})=>(
        <ListItem
          key={i}
          leftElement={<Icon name="book" type="font-awesome" color="#696969"/>}
          title={item.book_name}
          subtitle={item.message}
          titleStyle={{color: 'black',fontWeight: 'bold'}}
          bottomDivider
        />
     )


    render(){
        return(
            <View style={styles.container}>
            <View style={{flex:0.1}}>
                <MyHeader title={"Notifications"} navigation={this.props.navigation}/>
            </View>
            <View style={{flex: 0.9}}>
                {this.state.allNotifications.length===0}
                ?(
                    <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 25}}>You Have No Notifications!</Text>
                        </View>
                ):(
                    <SwipeableFlatlist allNotifications={this.state.allNotifications}/>
                )
            </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({ container : { flex : 1 } })
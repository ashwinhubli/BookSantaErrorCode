import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import {BookSearch} from 'react-native-google-books'
import { FlatList } from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize'
import {Input,Icon} from 'react-native-elements'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      bookName:"",
      reasonToRequest:"",
      isBookRequestActive: '',
      requestId:'',
      bookStatus:'', 
      requestedBookName:'',
      userDocId:'',
      docId: '',
      showFlatlist: false
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  async getBookFromAPI(bookName){
    this.setState({
      bookName: bookName
    })
    if(bookName.length>2){
      var books = await BookSearch.searchBook(bookName,'AIzaSyAiKWic00StY8CE-d8BSsAbTCJ1-9vBf5o')
      this.setState({
        dataSource: books.data,
        showFlatlist : true
      })
      
    }
  }

  renderItem=({item,i})=>{
    return(
      <TouchableHighlight style={{alignItems: 'center',backgroundColor: "#dddddd", padding: 10,width: '90%'}}
        activeOpacity={0.6}
        underlayColor="dddddd"
        onPress={()=>{
          this.setState({
            showFlatlist: false,
            book_name: item.volumeInfo.title,
          })
        }}  
        bottomDivider
      >
        <Text>{item.volumeInfo.title}</Text>
      </TouchableHighlight>
    )
  }

  addRequest =async(bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    var books = await BookSearch.searchBook(book_name,'AIzaSyAiKWic00StY8CE-d8BSsAbTCJ1-9vBf5o')

    db.collection('requested_books').add({
        "user_id": userId,
        "book_name":bookName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "book_status" : "requested",
        "date"  : firebase.firestore.FieldValue.serverTimestamp(),
        "image_link": books.data[0].volumeInfo.imageLinks.smallThumbnail
    })
     await this.getBookRequest();
     db.collection('users').where("email_id","==",userId).get()
     .then()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         db.collection('users').doc(doc.id).update({
           isBookRequestActve: true
         })
       })
     })
    this.setState({
        bookName :'',
        reasonToRequest : ''
    })

    return Alert.alert("Book Requested Successfully")
  }

getBookRequest=()=>{
  var bookRequest = db.collection("requested_books").where("user_id","==",this.state.userId).get()
   .then((snapshot)=>{
     snapshot.forEach((doc)=>{
       if(doc.data().book_status!=="received"){
         this.setState({
           request_id: doc.data().request_id,
           requestBookName: doc.data().book_name,
           bookStatus: doc.data().book_status,
           docId: doc.id
         })    
       }
     })
   })
}
getIsBookRequestActive=()=>{
  db.collection('users').where(emailId===this.state.userId)
  .onSnapshot((querySnapshot)=>{
     querySnapshot.forEach((doc)=>{
       this.setState({
         isBookRequestActive: doc.data().isBookRequestActive,
         userDocId: doc.id
       })
     })
  })
}
updateBookRequestStatus=()=>{
  db.collection('requested_books').doc(this.state.docId).update({
    book_status: 'received'
  })
  db.collection('users').where(email_id===this.state.userId).get()
  .then((snapshot)=>{
    db.collection('users').doc(doc.id).update({
      isBookRequestActive: false
    })
  })
}

  sendNotification=()=>{
    db.collection('users').where("email_id","==",this.state.userId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         var name = doc.data().first_name
         var lastName = doc.data().last_name    
     
     db.collection('all_notifications').where("request_id","==",this.state.requestId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         var donorId = donor_id
         var bookName = book_name 
         
      
     db.collection('all_notifications').add({
         "targeted_user_id": donorId,
         "message": name+ " " + lastName + "received the book" + book_name,
         "notification_status":"unread",
          "book_name": bookName 
        })
     })
    })
  })
})

  }

  receivedBooks=(book_name)=>{
   var userId = this.state.userId
   var requestId = this.state.requestId

   db.collection("received_books").add({
      "user_id": userId,
      "request_id": requestId,
      "book_name": bookName,
      "bookStatus": "received"
   })
  }

  render(){
    if(this.state.isBookRequestActive){
      return(
        <View style={{flex: 1,justifyContent: 'center'}}>
          <View style={{borderColor: 'orange',justifyContent: 'center', alignItems:'center',padding: 10,margin: 10}}>
            <Text>Book Name</Text>
            <Text>{this.state.requestedBookName}</Text>
          </View>
          <View style={{borderColor: 'orange',justifyContent: 'center', alignItems:'center',padding: 10,margin: 10}}>
            <Text>Book Status</Text>
            <Text>{this.state.bookStatus}</Text>
          </View>
          <TouchableOpacity style={{borderWidth: 1,borderColor: 'orange',backgroundColor: 'orange',width: 300,alignSelf: 'center',alignItems: 'center',height: 30,marginTop: 30}}
           onPress={()=>{
            this.sendNotification()
            this.updateBookRequestStatus()
            this.receivedBooks(this.state.requestBookName)
          }}
          >
            <Text>I Received The Book</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
    return(
        <View style={{flex:1}}>
          
          <MyHeader title="Request Book" navigation ={this.props.navigation}/>
              <View>
              <TextInput
                style ={styles.formTextInput}
                label={"Book-Name"}
                placeholder={"enter book name"}
                containerStyle={{marginTop: RFValue(60)}}
                onChangeText={(text)=>this.getBookFromAPI(text)}
                onClear={(text)=>this.getBookFromAPI("")}
                value={this.state.bookName}
              />
               {this.state.showFlatlist?
                (<FlatList
                   data={this.state.dataSource}
                   renderItem={this.renderItem}
                   enableEmptySections={true}
                   style={{marginTop: 10}}
                   keyExtractor={(item,index)=>index.toString()}
                />)
                :(
                  <View>
                
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                containerStyle={{marginTop: RFValue(30)}}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the book"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.bookName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
        </View>
                )}
              </View>
              </View>
                )}
              }}

   

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  })

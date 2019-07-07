import firebase from 'firebase';
import firestore from 'firebase/firestore';
import { saveData } from './utility';


export async function signUp(email, password, userType){
  firebase.auth().createUserWithEmailAndPassword(email, password).
    then(function(user) {
      saveData('orders', user.user.uid, {UserType: userType, UserId: user.user.uid} );
    }).catch(function(error) {
    alert(error.code + ': ' + error.message);
  });
}

export async function signIn(email, password){
  let success = true;
  await firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    success = false;
    alert(error.code + ': ' + error.message);
  });
  return success;
}

export async function getCurrentUserId(){
  var user = firebase.auth().currentUser;

  if (user != null) {
    return user.uid;
  }
}

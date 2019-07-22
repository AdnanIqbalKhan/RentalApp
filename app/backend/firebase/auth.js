import firebase from 'firebase';
import firestore from 'firebase/firestore';
import { saveData } from './utility';


export async function signUp(email, password, firstName, lastName) {
  firebase.auth().createUserWithEmailAndPassword(email, password).
    then(function (user) {
      let date = new Date();
      saveData('users',
        user.user.uid, {
          UserId: user.user.uid,
          firstName: firstName,
          lastName: lastName,
          dateJoined: date.toString(),
          rating: {
            star: -1,
            count: 0
          }
        });
    }).catch(function (error) {
      alert(error.code + ': ' + error.message);
    });
}

export async function signIn(email, password) {
  let success = true;
  await firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    success = false;
    alert(error.code + ': ' + error.message);
  });
  return success;
}

export async function getCurrentUserId() {
  var user = firebase.auth().currentUser;

  if (user != null) {
    return user.uid;
  }
}

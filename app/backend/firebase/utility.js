import firebase from 'firebase';
import firestore from 'firebase/firestore';
import { _storeData } from '../../backend/AsyncFuncs';
import GlobalConst from '../../config/GlobalConst';
import RNFetchBlob from 'react-native-fetch-blob';
import { Platform } from 'react-native';


let currentUserId = '';

export async function connectFirebase() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBIozGENFnnh2UEP1ndq4mWa3pODL1l3zk",
    authDomain: "rentalapp-69982.firebaseapp.com",
    databaseURL: "https://rentalapp-69982.firebaseio.com",
    projectId: "rentalapp-69982",
    storageBucket: "rentalapp-69982.appspot.com",
    messagingSenderId: "855889161975",
    appId: "1:855889161975:web:bf1e55f7361c4938"
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
}

export async function getAllOfCollection(collection) {
  let data = [];
  let querySnapshot = await firebase.firestore().collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push(doc.data());
    } else {
      console.log('No document found!');
    }
  });
  return data;
}

export async function getData(collection, doc, objectKey) {
  // check if data exists on the given path
  if (objectKey === undefined) {
    return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
      if (doc.exists) {
        return doc.data();
      } else {
        return false;
      }
    })
  }
  else {
    return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
      if (doc.exists && (doc.data()[objectKey] != undefined)) {
        return (doc.data()[objectKey]);
      } else {
        return false;
      }
    })
  }
}

export async function getDocByObjectKey(collection, key, value) {
  return firebase.firestore().collection(collection)
    .where(key, '==', value).get().then(function (querySnapshot) {
      let data = []
      querySnapshot.forEach(function (doc) {
        if (doc.exists) {
          data.push(doc.data());
        } else {
          console.log('No document found!');
        }
      });
      return data;
    });
}

export async function getDocByObjectKeyArray(collection, key, values) {
  let data = await getAllOfCollection(collection)
  return data.filter((e) =>  values.includes(e[key]))
}

export async function getDocByNotObjectKey(collection, key, value) {
  let data = await getAllOfCollection(collection)
  return data.filter((e) => e[key] != value)
}

export async function getDocWithinRange(collection, doc, strSearch) {
  let strlength = strSearch.length;
  let strFrontCode = strSearch.slice(0, strlength - 1);
  let strEndCode = strSearch.slice(strlength - 1, strSearch.length);

  let startcode = strSearch;
  let endcode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

  return firebase.firestore().collection(collection)
    .where(doc, '>=', startcode)
    .where(doc, '<', endcode).get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        //console.log(doc.data());
      });
    });
}

export async function dataExist(collection, doc) {
  // check if data exists on the given path
  return firebase.firestore().collection(collection).doc(doc).get().then(function (doc) {
    if (doc.exists) {
      return doc.data();
    } else {
      return false;
    }
  })
}

export async function updateData(collection, doc, jsonObject) {
  let docRef = await firebase.firestore().collection(collection).doc(doc);
  await docRef.update(jsonObject);
  return docRef;
}

export async function saveDataWithoutDocId(collection, jsonObject) {
  let docRef = await firebase.firestore().collection(collection).doc();
  await docRef.set(jsonObject);
  return docRef;
}

export async function saveData(collection, doc, jsonObject) {
  let docRef = await firebase.firestore().collection(collection).doc(doc);
  await docRef.set(jsonObject, { merge: true });
  return docRef;
}

export async function addToArray(collection, doc, array, value) {
  let docRef = await firebase.firestore().collection(collection).doc(doc);
  let docData = await docRef.get();
  if (docData.exists && (docData.data()[array] != undefined)) {
    docRef.update({
      [array]: firebase.firestore.FieldValue.arrayUnion(value)
    });
  }
  else {
    saveData(collection, doc, { [array]: [value] });
  }
  return docRef;
}

export async function uploadImage(imgUri, mime = 'image/jpeg', imagePath, name, databaseCollection, docRef, productFlag, databaseCollectionIndex = 0) {
  //blob
  const Blob = RNFetchBlob.polyfill.Blob;
  const fs = RNFetchBlob.fs;

  //keep reference to original value
  const originalXMLHttpRequest = window.XMLHttpRequest;
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
  window.Blob = Blob;

  const uploadUri = Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
  const imageRef = firebase.storage().ref(imagePath);

  let readingFile = await fs.readFile(uploadUri, 'base64');
  let blob = await Blob.build(readingFile, { type: `${mime};BASE64` });

  console.log(name)

  let uploadTask = imageRef.put(blob, { contentType: mime, name: name });

  let progress = 0;
  //Listen for state changes, errors, and completion of the upload.
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    function (snapshot) {
      console.log('Bytes transferred ' + snapshot.bytesTransferred);
      console.log('Total bytes ' + snapshot.totalBytes);
      // var progress = ( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
      if (progress < 30)
        progress += 10;
      else if (progress >= 30)
        progress += 5;
      else if (progress >= 85)
        progress += 1;
      else if (progress >= 95)
        progress += 0.1;

      _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, progress.toString());
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING:
          console.log('Upload is running');
          break;
      }
    },
    function (error) {
      console.log(error);
      _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, '-1').then(() => { return 0 });
    },
    function () {
      window.XMLHttpRequest = originalXMLHttpRequest;
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(async function (downloadURL) {
        console.log('File available at', downloadURL);

        //TODO a better way to update the array
        if (productFlag) {
          let docData = await docRef.get();
          let data = docData.data();
          console.log(data[databaseCollection])
          data[databaseCollection][databaseCollectionIndex].imageUrl = downloadURL
          updateData('products', docRef.id, data);
          _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, '100').then(() => {
            return 0
          });
        }
        else
          saveData(databaseCollection, docRef.id, { imageUrl: downloadURL }).then(() => {
            _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, '100').then(() => {
              return 0
            });
          });
      });
    }
  )
}


export async function downloadImage(folder, imageName) {
  var storageRef = firebase.storage().ref();
  var pathRef = storageRef.child(folder + '/' + imageName);

  let url = await pathRef.getDownloadURL()
  return url;
}



export async function deleteData(collection, doc, objectKey) {
  if (objectKey === undefined) {
    await firebase.firestore().collection(collection).doc(doc).delete();
  }
  else {
    let docRef = await firebase.firestore().collection(collection).doc(doc);
    await docRef.update({ [objectKey]: firebase.firestore.FieldValue.delete() });
  }
}

export function generateId(number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < number; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

function getUser(userId) {
    // [START get_document]
    let userRef = db.collection('users').doc(userId);
    let getDoc = userRef.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
                return 0
            } else {
                console.log('Document data:', doc.data());
                return doc.data()
            }

        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    // [END get_document]
    return getDoc;
}


exports.sendNotification = functions.firestore
    .document('requests/{requestId}')
    .onCreate((snap, context) => {
        const requestId = context.params.requestId;
        const requestData = snap.data();

        let onwer = getUser(requestData.postOnwerId);
        let token = onwer.fcmToken
        let requesterName = requestData.requesterName
        let postTitle = requestData.postTitle

        // Notification details.
        const payload = {
            notification: {
                title: 'You have a new rent request!',
                body: `${requesterName} is requested for ${postTitle}.`,
                // icon: follower.photoURL
            }
        };

        console.log(payload)
        return admin.messaging().sendToDevice(token, payload).then(reponse => {
            return console.log(`A new notification for ${onwer}`);
        });
    });
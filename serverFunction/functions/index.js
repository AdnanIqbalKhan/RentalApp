const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

sgMail.setApiKey(functions.config().sendgrid.key);

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

function sendEmail(to, message) {
    const msg = {
        to: to,
        from: 'test@example.com',
        subject: 'You have a new rent request!',
        text: message,
    };
    sgMail.send(msg)
        .then(resp => console.log(resp))
        .catch(err => console.log(err))
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
        sendEmail(onwer.email, `${requesterName} is requested for ${postTitle}.`)
        console.log(payload)
        return admin.messaging().sendToDevice(token, payload).then(reponse => {
            return console.log(`A new notification for ${onwer}`);
        });
    });
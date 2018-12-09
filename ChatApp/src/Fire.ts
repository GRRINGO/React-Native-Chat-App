import firebase, { User } from "firebase";
import { Alert } from "react-native";
import { ENV } from "../environment";
import { Permissions, Notifications } from "expo";
import { SystemMessage } from "react-native-gifted-chat";
import path from "react-native-path";

/*
  - /chats/
    - chat_id
      - title
      - lastMessage
  - /users/
    - user_id
      - displayName
      - email
      - resolution
      - picture
  - /members/
    - chat_id
      - displayName1: false
      - dispalyName2: true
      - ... (TODO: decide what is the best way to handle users) displayNames are unique, but still...
  - /messages/
    - chat_id
      - message_id
        - author (displayName)
        - message
  - /push_keys/
    - user_id
      - token
      - token...
*/

let fb_app: firebase.app.App;
export let fb_db: firebase.database.Reference;
let fb_storage: firebase.storage.Reference;

// tslint:disable-next-line:max-line-length
const defaultPicture = "https://firebasestorage.googleapis.com/v0/b/mcc-fall-2018-g13.appspot.com/o/robot-prod.png?alt=media&token=1088c6f3-b0e8-4fde-845e-a77095c33f15";
const defaultResolution = "full";

export const init = () => {
  const config = {
    apiKey: ENV.APIKEY,
    authDomain: ENV.AUTH_DOMAIN,
    databaseURL: ENV.DB_URL,
    projectId: ENV.PID,
    storageBucket: ENV.SBUCKET,
    messagingSenderId: ENV.SEND_ID,
  };
  fb_app = firebase.initializeApp(config);
  fb_db = firebase.database().ref();
};

// Create new chatroom
export const chat_create = (name: string, uid: string) => {
  let postData = {
    title: name,
    lastMessage: "",
  };
  let new_key = fb_db.ref.child("chats").push().key;
  let updates = {};
  // Add
  updates[`/chats/${new_key}/`] = postData;
  updates[`/members/${new_key}/${uid}/member`] = true;
  updates[`/members/${new_key}/${uid}/added`] = fb_db.ref.child("messages").push().key;
  console.log(updates);
  return [fb_db.ref.update(updates), updates];
};

// Add new user to chatroom
export const chat_adduser = (chat_id: string, user_id: string, adder_id: string) => {
  let new_key = fb_db.ref.child("messages").push().key;
  let updates = {};
  let message = {
    _id: new_key,
    text: `User ${user_id} was added by ${adder_id}`,
    createdAt: new Date(),
    system: true,
  };
  updates[`/members/${chat_id}/${user_id}/member`] = true;
  updates[`/members/${chat_id}/${user_id}/added`] = new_key;
  updates[`/chats/${chat_id}/lastMessage/`] = message.text;
  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates).catch((err) => console.error(err));
};

export interface ChatMessage {
  _id: string,
  text?: string,
  createdAt: Date,
  user: UserChatMessage,
  image?: string
}

export interface UserChatMessage {
  _id: string,
  auth_id: string,
  name: string,
  avatar?: string,
}
export const get_new_key = (child: string) => {
  if (!child) {
    child = "messages";
  }
  let new_key = fb_db.ref.child(child).push().key;
  return new_key;
};
// Send a message in chat
// reference images with some funky syntax
export const chat_send = (chat_id: string, message: ChatMessage) => {

  let new_key;
  if (!message._id) {
    new_key = fb_db.ref.child("messages").push().key;
    message._id = new_key;
  } else {
    new_key = message._id;
  }
  let updates = {};
  if (message.text) {
    updates[`/chats/${chat_id}/lastMessage/`] = `${message.user.name}: ${message.text}`;
  } else {
    updates[`/chats/${chat_id}/lastMessage/`] = `${message.user.name}: ${message.image}`;
  }

  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates);

};

// Leave chatroom
export const chat_leave = (chat_id: string, user_id: string, user_name: string) => {
  let new_key = fb_db.ref.child("messages").push().key;
  let message = {
    _id: new_key,
    text: `User ${user_name} left`,
    createdAt: new Date(),
    system: true,
  };
  let updates = {};
  updates[`/members/${chat_id}/${user_id}/member`] = false;
  updates[`/chats/${chat_id}/lastMessage/`] = message.text;
  updates[`/messages/${chat_id}/${new_key}/`] = message;
  return fb_db.ref.update(updates);
};

export const get_old_chat_messages = async (chat_id: string, resolution: string, uid: string) => {
  return new Promise<any[]>((resolve, reject) => {
    console.log("User id: ",uid)
    fb_db.ref.child("members").child(chat_id).orderByKey().equalTo(uid).once("value", snapshot =>{

      if (!snapshot) {
        resolve(undefined);
      }
      console.log("Snapshot: ",snapshot);

      snapshot.forEach( child => {
        let start_key;
        if(child && child.val() && child.val().added){
          start_key = child.val().added;

        } else {
          start_key = fb_db.ref.child("messages").push().key;
        }

        fb_db.ref.child("messages").child(chat_id).orderByKey().startAt(start_key).once("value", (snapshot) => {
          let messages = [];
          /* tslint:disable:no-string-literal */
          if (!snapshot) {
            resolve(undefined);
          }
          let promises = [];
          snapshot.forEach( child => {
            if (child && child.val() && child.val()["_id"]) {
              let message: ChatMessage;
              let systemMessage: SystemMessage;

              if (child.val().system) {
                systemMessage = child.val();
                messages.push(systemMessage);
              } else {
                message = child.val();
                if (!message.image) {
                  messages.push(message);
                } else {
                  let promise = image_get_raw(message.image, resolution)
                  .then(image => {
                    message.image = image;
                    messages.push(message);
                  });
                  promises.push(promise);
                }
              }
            }
            /* tslint:enable:no-string-literal */
          });
          Promise.all(promises)
          .then(() => {
            resolve(messages);
          });
        });
      });
    });
  });
};

export const update_message_info = async (msg: any, chat_id: string) => {
  return new Promise<ChatMessage | SystemMessage>((resolve, reject) => {
  if(msg.system){
    resolve(msg);
  } 

  fb_db.ref.child("members").child(chat_id).orderByKey().equalTo(msg.user._id).once("value", snapshot =>{
    if(!snapshot.exists()){
      console.log("User doesn't belong to the chat");
      resolve(undefined);
    }
  });

  fb_db.ref.child("users").orderByKey().equalTo(msg.user._id).once("value", snapshot => {
    if(!snapshot.exists()){
      console.log("User doesn't exist");
      resolve(undefined);
    }
    if(snapshot.val()){
      let updated_message: ChatMessage;
      updated_message = msg;
      updated_message.user.name = snapshot.val()[msg.user._id].displayName;
      console.log(snapshot.val()[msg.user._id].picture);
      updated_message.user.avatar = snapshot.val()[msg.user._id].picture;
      resolve(updated_message);
    } else {
      resolve(undefined);
    }
  });
  });
};

// retrieve list of 'ChatMessage's of all messages with image
export const chat_images = async (chat_id: string, resolution: string, uid: string) => {
  const all_messages = await get_old_chat_messages(chat_id, resolution, uid);
  const images = await all_messages.filter((element: ChatMessage) => {
    return element.image;
  });
  return images;
};

export interface GalleryImage {
  image: string;
  created: string;
  author: string;
  label: string;
}

const get_image_label = async (key: string) => {
  return firebase.database().ref(`/image_labels/${key}`).once("value");
};

export const get_gallery_images = async (chat_id: string, resolution: string, uid: string) => {
  const image_messages = await chat_images(chat_id, resolution, uid);
  // We basically change the array type here, removing all unneeded data.
  const res_images = await image_messages.map(async(elem) => {
    const label_key = elem.image.slice(elem.image.indexOf("chat_pictures"), elem.image.indexOf("?alt"));
    const snapshot = await get_image_label(label_key);
    const item: GalleryImage = {
      image: elem.image,
      created: elem.createdAt,
      author: elem.user.name,
      label: snapshot.val().description,
    };
    return item;
  });
  const res = await Promise.all(res_images);
  return res;
};

// get image with given resolution
export const image_get_raw = async (image_path: string, resolution: string) => {
  console.log("image get raw got a request");
  if (image_path.startsWith("chat_pictures")) {
    if (resolution === "full") {
      return firebase.storage().ref(image_path).getDownloadURL();
    } else if (resolution === "high") {
      if (path.basename(image_path) === "full") {
        return firebase.storage().ref(image_path).parent.child("HIGH").getDownloadURL();
      } else {
        return firebase.storage().ref(image_path).getDownloadURL();
      }
    } else { // resolution === "low"
      if (path.basename(image_path) === "low") {
        return firebase.storage().ref(image_path).getDownloadURL();
      } else {
        return firebase.storage().ref(image_path).parent.child("LOW").getDownloadURL();
      }
    }
    // return firebase.storage().ref(image_path).parent.child("high").getDownloadURL();

   }
   return image_path;
};

// same as above but with settings mandated resolution
export const image_get = async (image_path: string) => {
  // console.log("Image get was called");
  // console.log(path.basename(image_path))
  if (image_path.startsWith("chat_pictures")) {
   // return firebase.storage().ref(image_path).parent.child("high").getDownloadURL();
   return firebase.storage().ref(image_path).getDownloadURL();
  }
  return image_path;
};

// upload image to firebase => get image url
export const image_upload = async (image_path: string, folder: string, name: string) => {
  const blob = await urlToBlob(image_path);
  const ref = firebase.storage().ref(folder).child(name);
  const result = await ref.put(blob);
  console.log(result.ref.fullPath);
  return result.ref;

};

export const image_upload_chat = async (chat_id: string, image_path: string, resolution: "full" | "high" | "low") => {
  const result = await image_upload(image_path, `chat_pictures/${chat_id}/${Date()}`, resolution);
  return result.fullPath;
};

export const image_upload_profile = async (user_id: string, image_path: string) => {
  const result = await image_upload(image_path, "profile_pictures", user_id);
  return result.getDownloadURL();
};

function urlToBlob(url: string) {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
              resolve(xhr.response);
          }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
  });
}

// params are the mandatory info, not sure yet
export const user_create = (username: string, email: string, password: string) => {
  get_user(username)
  .then((user_profile) => {
    // Check if username is free
    if (!user_profile) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((error) => {
          const errorMessage = error.message;
          Alert.alert(errorMessage);
        })
        .then((user) => {
          if (user) {
            // Create userprofile on authentication success
            let postData = {
              displayName: username,
              email: email,
              resolution: defaultResolution,
              picture: defaultPicture,
            };
            // Also set user membership in all chats as false
            let new_key = user.user.uid;
            let updates = {};
            updates[`/users/${new_key}`] = postData;
            // TODO: Not sure if .on() is the correct method...
            // If we see missing chatrooms after new chat room creation this may be the issue
            fb_db.ref.child("chats").on("value", (snapshot) => {
              updates["members/" + snapshot.key + `/${user.user.uid}/member`] = false;
            });
            fb_db.ref.update(updates);
            update_user(username, user.user);
            update_expo_push_notification(user.user.uid);
          }
        });
    } else {
      Alert.alert("Username is already in use!");
    }
  });
};

export const update_user = (displayName: string, user: firebase.User) => {
  if (!user) {
    user = firebase.auth().currentUser;
  }
  user.updateProfile({
    displayName: displayName,
    photoURL: undefined,
  }).then(function() {
    console.log("Updated displayname successfully");
  }).catch(function(error) {
    console.log(error);
  });
};

export const user_state_change = (callback) => {
  firebase.auth().onAuthStateChanged(callback);
};

interface UserProfile {
  displayName: string;
  email: string;
  resolution: string;
  picture: string;
}

export const user_login = (username: string, passwd: string) => {
  get_user(username)
    .then((user: firebase.database.DataSnapshot) => {
      if (user) {
        user_login_email(user.val().email, passwd);
      } else {
        Alert.alert("Username doesn't exist");
      }
    }).catch((err) => console.error(err));
};

export const user_login_email = (email: string, passwd: string) => {
  firebase.auth().signInWithEmailAndPassword(email, passwd)
    .then((user) => {
      // Make sure push notifications are saved for the logged in user
      if (user) {
        update_expo_push_notification(user.user.uid).catch((err) => { console.error(err); });
      }
    })
    .catch((error) => {
      // let errorCode = error.code;
      const errorMessage = error.message;
      Alert.alert(errorMessage);
    });
};

export const get_user = (username: string, method?: "displayName" | "email") => {
  if (!method) {
    method = "displayName";
  }
  return new Promise(
    (resolve, reject) => {
    firebase.database().ref("users").orderByChild(method).equalTo(username)
      .on("value", (snapshot) => {
        snapshot.forEach((data) => {
          resolve(data);
        });
        reject("Error in get_user");
    },
    (err) => {
      console.error(err);
    });
  });
};

export const get_user_by_email = (email: string) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref().child("users").orderByChild("email")
      .equalTo(email).on("value", (snapshot) => {
        snapshot.forEach((data) => {
          resolve(data);
        });
        resolve(undefined);
    });
  });
};

// Get all chat rooms user is active in
export const active_chats = () => {
  let uid = firebase.auth().currentUser.uid;
  return new Promise((resolve, reject) => {
    const user_id_promise =  fb_db.ref.child("members").orderByChild(uid).once("value", function(snapshot) {
        let results = [];
        snapshot.forEach((data) => {
          if (data.val()[uid] && data.val()[uid].member) {
            results.push(data.key);
          }
        });
        resolve(results);
      });
    });
};

export const get_chat_details = (chats_list: Array<string>) => {
  let chat_promises = chats_list.map(function(key) {
    return firebase.database().ref("chats").child(key).once("value");
  });
  return chat_promises;
};

// results
export const user_search = (search_term: string) => {
  return new Promise((resolve, reject) => {
    firebase.database().ref().child("users").orderByChild("displayName")
      .startAt(search_term).endAt(search_term+"\uf8ff").on("value", (snapshot) => {
        let users = [];
        snapshot.forEach((data) => {
          let user = data.val()
          user.key = data.key
          users.push(user);
        });
        resolve(users);
    });
  });
};

// value
export const settings_get = (key: string) => {
  return;
};

// value
export const settings_set = async (key: string, value: UserProfile) => {
  let updates = {};
  updates[`/users/${key}`] = value;
  return fb_db.ref.update(updates);
};

export const profile_picture_set = () => {
  return;
};

// SETTINGS_KEYS
// -------------
// DISPLAY_NAME
// RESOLUTION

// Expo push notification token. We save them (if using multiple devices) with firebase.User.user.uid in to /push_keys/
export const update_expo_push_notification = async (user_id: string) => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS,
  );
  let finalStatus = existingStatus;
  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== "granted") {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  // Stop here if the user did not grant permissions
  if (finalStatus !== "granted") {
    return;
  }
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  let postData = {
    token: token,
  };
  // Firebase does not allow [] characters... So we encode the keys
  let encoded_key = encode_push_key(token);
  let updates = {};
  updates[`/push_keys/${user_id}/${encoded_key}`] = postData;
  return fb_db.ref.update(updates);
};

// Assume every key starts with ExponentPushToken[ and ends in ]. We just parse these.
const encode_push_key = (decoded: string) => {
  let regex = /ExponentPushToken\[(.*)\]/;
  return decoded.match(regex)[1];
};

const decode_push_key = (encoded: string) => {
  return "ExponentPushToken[".concat(encoded).concat("]");
};

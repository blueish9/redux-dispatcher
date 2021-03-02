[![npm version](https://badge.fury.io/js/redux-dispatcher.svg)](https://badge.fury.io/js/redux-dispatcher)


## redux-dispatcher is an all-in-one simple solution to manage actions with less code 🦄
**It's main purpose is to combine action type, action creator and dispatch function into one,
 then you no need to worry about defining and managing action type constants.**

**Guaranteed**:
- No new concept to learn, nothing different from Redux paradigm.
- Easy to adapt.
- Easy to read and write.
- Less code.

**Suitable**:
- For people who have already familiar with Redux.
- If you need to use Redux and want to reduce boilerplate.
- If you find it tiresome every time you need to define, import, manage action type constants.

**Advanced functionalities**:
- [Action with side effect](#user-content-retrieve-side-effect-result-after-dispatching-an-action-no-more-callback)
- [Thunk support](#user-content-define-thunk-like-your-favourite-redux-thunk)
- [Immutable helpers](#user-content-immutable-helper-for-state)

---

## Usage
### 1. Install and setup
```yarn add redux-dispatcher```

or

```npm install redux-dispatcher --save```


**Setup**
```js
import {applyMiddleware, createStore} from "redux";
import {dispatcherMiddleware} from "redux-dispatcher";

const store = createStore(
    reducer,
    applyMiddleware(dispatcherMiddleware)
);
```

### 2. Define action type, action creator and dispatch action

before          |  after
:-------------------------:|:-------------------------:
![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/action_before.png)  |  ![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/action_after.png)

With **redux-dispatcher**, the action type is implicitly computed according to the ```key``` passed to ```synthesize``` method and the name of the action creator.

But if you want to explicitly specify a type, you can include a ```type``` property in the return object.  
```js
import {synthesize} from "redux-dispatcher";

const key = "profile";

const mapDispatchToAC = {
    // type = "profile/FETCH_PROFILE"
    // if the action doesn't depend on parameters, you can just write a plain object
    fetchProfile: {loading: true},

    // if not explicitly specified, the action type will be automatically set: type = "profile/UPDATE_PROFILE"
    updateProfile: (username, password) => ({
        // type: "UPDATE_PROFILE",     you can specify the action type here
        username, password
    })
};

const profileDispatcher = synthesize(key, mapDispatchToAC);
```

To dispatch action, you can just import the dispatcher you need and dispatch action anywhere you want 

```js
profileDispatcher.updateProfile("my_username", "my_password");
```

### 3. Handle action in reducer

before          |  after
:-------------------------:|:-------------------------:
![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/reducer_before.png)  |  ![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/reducer_after.png)

Create ```reducer``` with **redux-dispatcher** is as easy as create usual ```reducer```, with less code.
```js
const mapActionToReducer = {
     // similar to fall-through case in switch statement
     [[
       profileDispatcher.fetchProfile,
       profileDispatcher.reloadProfile,
       profileDispatcher.resetProfile
     ]]: (state, payload) => payload,    // notice the payload, it doesn't have "type" property like action
     
     [profileDispatcher.loadingProfile]: {loading: true},    // you can just write a plain object if new state doesn't computed from current state or action payload
     
     [profileDispatcher.updateProfile]: (state, {username, password}) => ({
       username,
       password: encrypt(password)
     })    // only return what data need to be merged in state
     
     // the default case is handled automatically
}

const profileReducer = profileDispatcher(initialState, mapActionToReducer);

// profileReducer will match with key from profileDispatcher.key ("profile")

// profileReducer = { profile: reducer function }
const rootReducer = combineReducers({
  ...profileReducer,
});
```


### 4. Advanced functionalities
This section describes some useful features and extensions you may find interesting like thunk and immutable helper.    

#### Retrieve side effect result after dispatching an action (no more callback)
<details>
<summary>
When your action trigger some side effect (like API request), 
you can use a built-in <b>$result</b> helper as an alternative mechanism for callback.

(Available from v1.7)
</summary>
  
[See example](https://github.com/blueish9/redux-dispatcher/example/enhanceAction.js).

Use case with React:
```js
const mapDispatchToAC = {
  fetchProfile: userId => ({ userId }),
};

const userDispatcher = synthesize('user', mapDispatchToAC);
```
```js
async componentDidMount() {
  const action = userDispatcher.fetchProfile(userId)
  const profile = await action.$result
  this.setState({ profile })  // { name: "Emily" }
}
```
In your side effect handler (example with [Redux Saga](https://redux-saga.js.org)):
```js
import { takeLeading } from 'redux-saga/effects'

function* fetchProfile(action) {
  const profile = { name: "Emily" }   // call your side effect here (like API request)
  action.$result = profile
}

// an alternative syntax to use with object destructuring
/*
function* fetchProfile({ userId, $result }) {
  const profile = { name: "Emily" }
  $result.value = profile
}
*/

function* sagaWatcher() {
  yield takeLeading(userDispatcher.fetchProfile, fetchProfile)
}
```
</details>

---

#### Define thunk like your favourite [Redux Thunk](https://github.com/reduxjs/redux-thunk)
<details>
<summary>
See example
</summary>

```js
const mapDispatchToAC = {
  fetchUser: id => ({dispatch, getState, context}) => {
    // do something
  }
}
```

You can also provide global context to `dispatcherMiddleware` 
just like how Redux Thunk middleware **inject** custom arguments, 
[read more](https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument).
```js
import {dispatcherMiddleware} from "redux-dispatcher"

const context = {
  BASE_API_URL,
  FetchHelper
}

const store = createStore(
    reducer,
    applyMiddleware(dispatcherMiddleware.withContext(context))
)
```
</details>

---

#### Immutable helpers for state
<details>
<summary>
See example
</summary>

```js
const profileReducer = profileDispatcher(initialState, {
    /* equivalent to:
       case "profile/UPDATE_STREET":
          return {
            ...state,
            userInfo: {
              ...state.userInfo,
              address: {
                ...state.userInfo.address,
                street: action.street
              }
            }
          }
    */
    [profileDispatcher.updateStreet]: (state, {street}, {set}) => ({
      street: set('userInfo.address.street', street)
    })
});
```

All immutable helper functions are based on [dot-prop-immutable](https://github.com/debitoor/dot-prop-immutable)
```js
[profileDispatcher.updateStreet]: (state, payload, {get, set, merge, toggle, remove}) => ({
   
})
```
</details>

---
#### Easily manage action types
<details>
<summary>
See example
</summary>

```js
profileDispatcher.key === "profile"    // true
profileDispatcher.updateProfile.type === "profile/UPDATE_PROFILE"    // true

/* equivalent to:
   const handler = {
      "profile/UPDATE_PROFILE": (state, payload) => {}
   }
*/
const handler = {
  [profileDispatcher.updateProfile]: (state, payload) => {}
} 
```

An example when working with [Redux Saga](https://redux-saga.js.org): Instead of passing an action type, you can just pass a dispatcher function to the ```takeLatest``` function.
```js
const action = yield take(profileDispatcher.updateProfile)
// action = { type, username, password }
```
</details>

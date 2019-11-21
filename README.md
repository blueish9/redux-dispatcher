[![npm version](https://badge.fury.io/js/redux-dispatcher.svg)](https://badge.fury.io/js/redux-dispatcher)


## redux-dispatcher is another opinionated helper library working along side with Redux.
**It's main purpose is to combine action type, action creator and store's dispatch function into one, then you no need to worry about defining and managing action type constants.**

**Guaranteed**:
- No new concept to learn, nothing different from Redux paradigm.
- Easy to adapt.
- Easy to read and write.
- Less code.
- Get on well with IDE lookup (Find usages, Refactor).


**Suitable**:
- For people who have already familiar with Redux.
- If you need to use Redux but want to reduce boilerplate.
- If you find it tiresome every time you need to define, import, manage action type constants.


## Usage
### 1. Install and setup
```yarn add redux-dispatcher```

or

```npm install redux-dispatcher --save```


**Setup**
```js
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

With **redux-dispatcher**, the action type will be implicitly computed according to the ```key``` passed to ```synthesize``` method and the name of the action creator.

But if you want to explicitly specify a type, you can include a ```type``` property in the return object.  
```js
import {synthesize} from "redux-dispatcher";

const key = 'profile';

const mapDispatchToAC = {
    // type = "profile/FETCH_PROFILE"
    // if the action doesn't depend on parameters, you can just write an object like this
    fetchProfile: {loading: true},

    // if not explicitly specified, the action type will be automatically set: type = "profile/UPDATE_PROFILE"
    updateProfile: (username, password) => ({
        // type: 'UPDATE_PROFILE',     you can specify the action type here
        username, password
    })
};

const profileDispatcher = synthesize(key, mapDispatchToAC);
```

To dispatch action, this is what you usually do (without redux-dispatcher):
```js
// use store directly (not recommended)
store.dispatch(fetchProfile());


// or with react-redux
class ProfileView extends React.Component {
    componentDidMount() {
        this.props.fetchProfile();
    }

    //...
}

const mapDispatchToProps = {fetchProfile, updateProfile};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
```

Replace the old code with **redux-dispatcher**, you can just import the dispatcher you need and dispatch action anywhere you want 

```js
profileDispatcher.updateProfile("my_username", "my_password");
```

### 3. Handle action in reducer

before          |  after
:-------------------------:|:-------------------------:
![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/reducer_before.png)  |  ![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/reducer_after.png)
![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/root_reducer_before.png)  |  ![after](https://quan-vo-blog.firebaseapp.com/img/redux-dispatcher/root_reducer_after.png)

Create ```reducer``` with **redux-dispatcher** is as easy as casual ```reducer```, with less code.
```js
// profileReducerObject = { profile: reducer function }
profileDispatcher(initialState, {
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
    
    // the default case is handle automatically
});
```

### 4. Work with other third-party Redux libraries
An example when working with Redux Saga: Instead of passing an action type, you can just pass a dispatcher function to the ```takeLatest``` function.
```js
function* updateProfile({username, password}) {
  
}

function* profileWatcher() {
  yield all([
  // instead of passing an actiont type, you can just pass a dispatcher function
    takeLatest(profileDispatcher.updateProfile, updateProfile),
  ])
}
```

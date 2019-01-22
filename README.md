## redux-dispatcher is another opinionated helper library working along side with Redux.
**It's main purpose is to combine action type, action creator and store's dispatch function into one, then you no need to worry about defining and managing action type constants.**

**Guaranteed**:
- No breaking change, no new concept, nothing different from Redux paradigm: define action (payload), dispatch action, use reducer to handle action and return new state.
- Easy to adapt.
- Easy to read and write.
- Less code.
- Get on well with IDE lookup (Find usages, Refactor).


**Suitable**:
- For people who have already familiar with Redux.
- If you still need to use Redux but want to reduce boilerplate.
- If you find it tiresome everytime you need to define, import, manage action type constants.


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

Define action type, action creator
```js
export const FETCH_PROFILE = "FETCH_PROFILE";
export const UPDATE_PROFILE = "UPDATE_PROFILE";

export const fetchProfile = () => ({
    type: FETCH_PROFILE,
    loading: true
});

export const updateProfile = (username, password) => ({
    type: UPDATE_PROFILE,
    username, password
});
```

Dispatch action
```js
// use store directly
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

#### Replace with redux-dispatcher
The action type will be implicitly computed according to the ```key``` passed to ```synthesize``` method and the name of the action creator.

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
        //type: 'UPDATE_PROFILE',     you can specify the action type here
        username, password
    })
};

export default profileDispatcher = synthesize(key, mapDispatchToAC);
```
```js
// dispatch action
profileDispatcher.updateProfile("my_username", "my_password");
```

### 3. Handle action in reducer
```js
const profileReducer = (state = initialState, action) => {
    const {type, ...payload} = action;
    switch (type) {
      case FETCH_PROFILE:
      case RELOAD_PROFILE:
      case RESET_PROFILE:
          return {
            ...state,
            ...payload
          };
    
      case LOADING_PROFILE:
          return {
              ...state,
              loading: true
          };
    
      case UPDATE_PROFILE:
        const {username, password} = payload;
        return {
          ...state,
          username,
          password: encrypt(password)
        };
      
      default:
        return state;
    }
};

const rootReducer = combineReducers({
  profile: profileReducer,
});
```
Replace with redux-dispatcher
```js
const profileReducerObject = profileDispatcher(initialState, {
    // similar to fall-through case in switch statement
    [[
      profileDispatcher.fetchProfile,
      profileDispatcher.reloadProfile,
      profileDispatcher.resetProfile
    ]]: (state, payload) => payload,    // notice the payload, it doesn't have type property like action
    
    [profileDispatcher.loadingProfile]: {loading: true},    // you can just write a plain object if new state doesn't computed from current state or action payload
    
    [profileDispatcher.updateProfile]: (state, {username, password}) => ({
      username,
      password: encrypt(password)
    })    // only return what data need to be merged in state
    
    // the default case is handle automatically
});

// profileReducerObject = {profile: reducer function}
const rootReducer = combineReducers({
    ...profileReducerObject,
});
```

### 4. Work with other third-party Redux libraries
An example when working with Redux Saga: Instead of passing an actiont type, you can just pass a dispatcher function to the ```takeLatest``` function.
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

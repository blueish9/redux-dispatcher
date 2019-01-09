## redux-dispatcher is another opinionated helper library working along side with Redux.
**It's main purpose is to combine action type, action creator and store's dispatch function into one, then you no need to worry about defining and managing action type constants.**

## Usage
### 1. Define action type, action creator and dispatch action

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
```js
import {synthesize} from "redux-dispatcher";

const key = 'profile';

const mapDispatchToAC = {
// type = "profile/FETCH_PROFILE"
// if the action doesn't depend on parameters, you can just write an object like this
fetchProfile: {loading: true},    // 

// type = "profile/UPDATE_PROFILE"
updateProfile: (username, password) => ({username, password})
};

export default profileDispatcher = synthesize(key, mapDispatchToAC);
```
```js
// dispatch action
profileDispatcher.updateProfile("my_username", "my_password");
```

### 2. Handle action in reducer
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

case LOADING_PROFLE:
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
profileDispatcher.updateProfile,
profileDispatcher.reloadProfile,
profileDispatcher.resetProfile
]]: (state, payload) => payload,    // notice the payload, it doesn't have type property like action

[profileDispatcher.loadingProfile]: {loading: true},    // write a plain object if new state doesn't computed from current state or action payload

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

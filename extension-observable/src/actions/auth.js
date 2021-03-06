import { CLIENT_ID, REDIRECT_URI } from '../constants/auth';
import * as actionTypes from '../constants/actionTypes';
import { setTracks } from '../actions/track';

export function auth() {
  return {
    type: actionTypes.AUTH
  };
}

function setSession(session) {
  return {
    type: actionTypes.SESSION_SET,
    session
  };
}

function setMe(user) {
  return {
    type: actionTypes.ME_SET,
    user
  };
}

export const authEpic = (action$) =>
  action$.ofType(actionTypes.AUTH)
    .mapTo(SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI }))
    .mergeMap(SC.connect)
    .map(setSession);

export const fetchMeEpic = (action$) =>
  action$.ofType(actionTypes.SESSION_SET)
    .map((action) => action.session)
    .mergeMap(fetchMe)
    .map(setMe);

export const fetchStreamEpic = (action$) =>
  action$.ofType(actionTypes.SESSION_SET)
    .map((action) => action.session)
    .mergeMap(fetchStream)
    .map((data) => data.collection)
    .map(setTracks);

const fetchMe = (session) =>
  fetch(`//api.soundcloud.com/me?oauth_token=${session.oauth_token}`)
    .then((response) => response.json());

const fetchStream = (session) =>
  fetch(`//api.soundcloud.com/me/activities?limit=20&offset=0&oauth_token=${session.oauth_token}`)
    .then((response) => response.json())

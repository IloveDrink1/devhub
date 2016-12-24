// @flow

import moment from 'moment';
import { arrayOf, normalize } from 'normalizr';
import { delay, takeEvery } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { NotificationSchema } from '../utils/normalizr/schemas';
import { accessTokenSelector, notificationIdsSelector } from '../selectors';

import { LOAD_NOTIFICATIONS_REQUEST } from '../utils/constants/actions';

import type { Action, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

import {
  loadNotificationsRequest,
  loadNotificationsSuccess,
  loadNotificationsFailure,
} from '../actions';

import { authenticate, getApiMethod } from '../api/github';

const sagaActionChunk = { dispatchedBySaga: true };

function* onLoadNotificationsRequest({ payload }: Action<ApiRequestPayload>) {
  const state = yield select();
  const accessToken = accessTokenSelector(state);
  if (!accessToken) return;

  yield call(authenticate, accessToken);

  // just to have the token on success/failure actions
  const requestPayload = { ...payload, accessToken };

  try {
    const { params, requestType } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, 10000),
    });

    if (timeout) throw new Error('Timeout', 'TimeoutError');

    const { data, meta }: ApiResponsePayload = response;
    // console.log('onLoadNotificationsRequest response', response);

    const normalizedData = normalize(data, arrayOf(NotificationSchema));
    yield put(loadNotificationsSuccess(requestPayload, normalizedData, meta, sagaActionChunk));
  } catch (e) {
    console.log('onLoadNotificationsRequest catch', e);
    const errorMessage = (e.message || {}).message || e.message || e.body || e.status;
    yield put(loadNotificationsFailure(requestPayload, errorMessage, sagaActionChunk));
  }
}

function* startTimer() {
  yield take(REHYDRATE);

 // load notifications each minute
  while (true) {
    const state = yield select();
    const notificationIds = notificationIdsSelector(state);
    const isEmpty = notificationIds.size <= 0;

    const lastModifiedAt = state.getIn(['notifications', 'lastModifiedAt']);
    const params = isEmpty
      ? {
        all: true,
        since: (lastModifiedAt ? moment(new Date(lastModifiedAt)) : moment().subtract(1, 'month')).format(),
      }
      : {
        since: moment().subtract(1, 'day').format(),
      }
    ;

    params.headers = {};
    if (!isEmpty && lastModifiedAt) params.headers['If-Modified-Since'] = lastModifiedAt;

    yield put(loadNotificationsRequest(params, sagaActionChunk));
    yield call(delay, 60 * 1000);
  }
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_NOTIFICATIONS_REQUEST, onLoadNotificationsRequest),
    yield fork(startTimer),
  ];
}

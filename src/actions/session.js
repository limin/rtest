/**
 * @file
 * 
 * @copyright 2018 {@link https://limin.github.io Min Li}
 * 
 * @license Licensed under {@link https://www.apache.org/licenses/LICENSE-2.0.html Apache License 2.0}
 * 
 */

export const LANGUAGE_CHANGED='LANGUAGE_CHANGED'
export const MESSAGES_DELETED='MESSAGES_DELETED'
export const MESSAGES_RECEIVED='MESSAGES_RECEIVED'
export const USER_LOGGED_IN='USER_LOGGED_IN'
export const USER_LOGGED_OUT='USER_LOGGED_OUT'

export function userLoggedOut(){
	return {
    	type: USER_LOGGED_OUT
    }
}

export function userLoggedIn(user){
	return {
    	type: USER_LOGGED_IN,
    	user
    }
}

export function messagesDeleted(names){
	return {
    	type: MESSAGES_DELETED,
    	names
    }
}

export function messagesReceived(messages){
	return {
    	type: MESSAGES_RECEIVED,
    	messages
    }
}

export function languageChanged(language){
	return {
    	type: LANGUAGE_CHANGED,
    	language
    }
}
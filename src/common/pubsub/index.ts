import { PubSub } from 'graphql-subscriptions';

export const pubsub = new PubSub();

// Subscription event names
export const SUBSCRIPTION_EVENTS = {
  SWAP_UPDATED: 'SWAP_UPDATED',
  NEW_SWAP_REQUEST: 'NEW_SWAP_REQUEST',
  CHAT_CREATED: 'CHAT_CREATED',
  NEW_MESSAGE: 'NEW_MESSAGE'
};
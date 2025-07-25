import { pubsub, SUBSCRIPTION_EVENTS } from "src/common/pubsub";

const testMutation = () => {
  pubsub.publish(SUBSCRIPTION_EVENTS.TEST_EVENT, { data: "Hello World" });
  return "Test mutation executed successfully";
};

const testSubscription = {
  subscribe: () => {
    console.log("🧪 Test subscription started");
    return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.TEST_EVENT);
  },
  resolve: (payload: any) => {
    console.log("🧪 Test subscription payload:", payload);
    return payload;
  },
};

export const generalResolver = {
  Query: {
    hello: () => "Hello world",
  },

  Mutation: {
    testMutation,
  },

  Subscription: {
    testSubscription
  }
};

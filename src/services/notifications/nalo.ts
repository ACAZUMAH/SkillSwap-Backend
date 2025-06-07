import axios from "axios";
import createError from "http-errors";
import logger from "src/loggers/logger";
interface NaloSmsOptions {
  to: string;
  message: string;
}

export const sendNaloSms = async (data: NaloSmsOptions) => {
  const url = `${process.env.NALO_SMS_API_URL}`;
  const apiKey = `${process.env.NALO_SMS_API_KEY}`;

  const info = {
    key: apiKey,
    msisdn: data.to,
    message: data.message,
    sender_id: "MentorMe",
  };

  try {
    const res = await axios.post(url, info);

    const resStringfy = JSON.stringify(res.data);

    if (!resStringfy.includes(data.to.replace("+", ""))) {
      throw createError.InternalServerError(
        `Failed to send SMS: ${resStringfy}`
      );
    }
  } catch (error) {
    logger.error("Error sending SMS via Nalo:", error);
    return false;
  }
  return true;
};

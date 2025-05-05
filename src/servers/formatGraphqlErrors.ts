import { GraphQLFormattedError } from "graphql";
import { unwrapResolverError } from '@apollo/server/errors'
import createError from 'http-errors'
import logger from "src/loggers/logger";
import { STATUS_CODES } from "src/common/constants/errors";

export const formatError = (formatError: GraphQLFormattedError, error: unknown) => {
    const unwrapError: any = unwrapResolverError(formatError)

    logger.error(unwrapError)

    if(createError.isHttpError(unwrapError)){
        return formatError
    }

    const formattedGraphqlError = {
        ...formatError,
        message: unwrapError.message,
        extentions: {
            ...formatError.extensions,
            code: STATUS_CODES.get(unwrapError.status) || "INTERNAL_SERVER_ERROR"
        }
    }
    
    return formattedGraphqlError
};

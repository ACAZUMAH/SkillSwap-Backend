import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import createError from 'http-errors'
import { createUserInput } from 'src/common/interfaces'

const ajv = new Ajv({ allErrors: true })

addFormats(ajv)
addErrors(ajv)

ajv.addFormat("phone", {
    type: "string",
    validate: (value: string) => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;
        return phoneRegex.test(value)
    }

})

ajv.addFormat("password", {
    type: 'string',
    validate: (value: string) => {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        return passwordRegex.test(value)
    }
})

const userValidationSchema = {
  type: "object",

  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string", format: "email" },
    phoneNumber: { type: "string", format: "phone" },
    password: { type: "string", format: "password" },
  },

  required: ["phoneNumber"],

  errorMessage: {

    properties: {
      firstName: "First name must be a string",
      lastName: "Last name must be a string",
      email: "Email must be a string",
      password:
        "Password must be at least 8 characters long, include (A-Z), (a-z), (1-9), and a special character",
    },

    required: {
      phoneNumber: "Phone Number is required",
      password: "Password is required",
    },
  },
};

export const validateCreateUserData = (data: createUserInput) => {

    const validate = ajv.compile(userValidationSchema)

    const isValid = validate(data)

    if(!isValid){
        throw createError(400, ajv.errorsText(validate.errors))
    }
}
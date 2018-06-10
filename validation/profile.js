const Validator = require('validator');

const isEmpty = require('./is-empty');

const validateProfileInput = (data) => {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    // Validate handle
    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = 'Handle needs to be between 2 and 40';
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    }

    // Validate status
    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }

    // Validate skills
    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Skills field is required';
    }

    // Validate URL
    if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
        errors.website = 'Not a valid URL';
    }

    // Validate social media
    if (!isEmpty(data.youtube) && !Validator.isURL(data.youtube)) {
        errors.youtube = 'Not a valid URL';
    }

    if (!isEmpty(data.twitter) && !Validator.isURL(data.twitter)) {
        errors.twitter = 'Not a valid URL';
    }

    if (!isEmpty(data.facebook) && !Validator.isURL(data.facebook)) {
        errors.facebook = 'Not a valid URL';
    }

    if (!isEmpty(data.linkedin) && !Validator.isURL(data.linkedin)) {
        errors.linkedin = 'Not a valid URL';
    }

    if (!isEmpty(data.instagram) && !Validator.isURL(data.instagram)) {
        errors.instagram = 'Not a valid URL';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};

module.exports = validateProfileInput;
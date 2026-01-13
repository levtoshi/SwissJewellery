export const validateCheckout = (name, value) => {
    const errors = {};

    switch(name) {
        case "fullName":
            if (!value?.trim())
                errors.fullName = "Full name is required";
            else if (value?.length < 2)
                errors.fullName = "Full name must be at least 2 characters long";
            else if (value?.length > 100)
                errors.fullName = "Full name must be no more than 100 characters long";
            break;

        case "email":
            if (!value?.trim())
                errors.email = "Email is required";
            else
            {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim()))
                {
                    errors.email = "Invalid email format";
                }
            }
            break;

        case "phone":
            if (!value?.trim())
                errors.phone = "Phone number is required";
            else
            {
                const phoneRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
                if (!phoneRegex.test(value.trim()))
                {
                    errors.phone = "Invalid phone number format";
                }
            }
            break;

        case "address":
            if (!value?.trim())
                errors.address = "Delivery address is required";
            else if (value?.length < 10)
                errors.address = "Address must be at least 10 characters long";
            else if (value?.length > 500)
                errors.address = "Address must be no more than 500 characters long";
            break;

        case "comment":
            if (value && value.length > 1000)
                errors.comment = "Comment must be no more than 1000 characters long";
            break;

        default:
            break;
    }

    return errors;
};
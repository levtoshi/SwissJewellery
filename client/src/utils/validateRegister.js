export const validateRegister = (name, value, form = {}) => {
    const errors = {};

    switch (name) {
        case "email": {
            const email = value?.trim() || "";

            if (!email) {
                errors.email = "Email is required";
                break;
            }

            if (email.length < 5 || email.length > 100) {
                errors.email = "Email length must be between 5 and 100 characters";
                break;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Invalid email format";
            }
            break;
        }

        case "password": {
            const password = value || "";

            if (!password) {
                errors.password = "Password is required";
                break;
            }

            if (password.length < 8) {
                errors.password = "Password must be at least 8 characters";
                break;
            }

            if (!/[A-Za-z]/.test(password)) {
                errors.password = "Password must contain at least one letter";
                break;
            }

            if (!/\d/.test(password)) {
                errors.password = "Password must contain at least one number";
            }
            break;
        }

        case "retryPassword": {
            if (!value) {
                errors.retryPassword = "Repeat password is required";
                break;
            }

            if (value !== form.password) {
                errors.retryPassword = "Passwords do not match";
            }
            break;
        }

        case "fullName": {
            const nameVal = value?.trim() || "";

            if (!nameVal) {
                errors.fullName = "Full name is required";
                break;
            }

            if (nameVal.length < 3) {
                errors.fullName = "Full name must be at least 3 characters";
            }
            break;
        }

        case "phone": {
            const phone = value?.trim() || "";
            const phoneRegex = /^\+?[0-9]{10,15}$/;

            if (!phone) {
                errors.phone = "Phone is required";
                break;
            }

            if (!phoneRegex.test(phone)) {
                errors.phone = "Invalid phone number";
            }
            break;
        }

        case "address": {
            const address = value?.trim() || "";

            if (!address) {
                errors.address = "Address is required";
                break;
            }

            if (address.length < 5) {
                errors.address = "Address is too short";
            }
            break;
        }

        default:
            break;
    }

    return errors;
};
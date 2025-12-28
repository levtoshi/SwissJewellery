export const validateLogin = (name, value) => {
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

        default:
            break;
    }

    return errors;
};
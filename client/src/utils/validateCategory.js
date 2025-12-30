export const validateCategory = (name, value) => {
    const errors = {};

    switch (name) {
        case "name": {
            const categoryName = value?.trim() || "";

            if (!categoryName) {
                errors.name = "Category name is required";
                break;
            }

            if (categoryName.length < 2) {
                errors.name = "Name must be at least 2 characters long";
                break;
            }

            if (categoryName.length > 50) {
                errors.name = "Name must be shorter than 50 characters";
                break;
            }

            break;
        }

        case "description": {
            const description = value?.trim() || "";

            if (description.length > 500) {
                errors.description =
                    "Category description must be shorter than 500 characters";
            }

            break;
        }

        default:
            break;
    }

    return errors;
};

export const validateProduct = (name, value) => {
    const errors = {};

    switch(name) {
        case "name":
            if (!value?.trim())
                errors.name = "Product name is required";
            else if (value?.length < 3)
                errors.name = "Product description must be at least 3 chars long";
            else if (value?.length >= 200)
                errors.name = "Product description must be no more than 200 chars long";
            break;

        case "description":
            if (!value?.trim())
                errors.description = "Product description is required";
            else if (value?.length < 10)
                errors.description = "Product description must be at least 10 chars long";
            else if (value?.length >= 2000)
                errors.description = "Product description must be no more than 2000 chars long";
            break;

        case "price":
            if (value === "" || value === null || isNaN(value)) {
                errors.price = "Price is required";
            } else if (Number(value) <= 0) {
                errors.price = "Price must be greater than 0";
            }
            break;

        case "discount":
            if (value !== "" && (Number(value) < 0 || Number(value) > 99)) {
                errors.discount = "Discount must be between 0 and 99%";
            }
            break;

        case "stock":
            if (value === "" || value === null || isNaN(value)) {
                errors.stock = "Stock is required";
            } else if (Number(value) < 0) {
                errors.stock = "Stock cannot be negative";
            }
            break;

        case "image":
            if (!value?.trim()) {
                errors.image = "Main image is required";
            } else {
                const urlRegex = /^(https?:\/\/[^\s]+)$/i;
                if (!urlRegex.test(value.trim())) {
                    errors.image = "Invalid image URL";
                }
            }
            break;

        case "category":
            if (!value?.trim()) errors.category = "Category is required";
            break;

        default:
            break;
    }

    return errors;
};
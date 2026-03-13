export function getErrorMessage(error) {
    switch(error.name) {
        case 'ValidationError': {
            return Object.values(error.errors).at(0).message;
        }
        default: {
            return error.message;
        }
    }
}
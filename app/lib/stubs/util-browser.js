export function promisify(fn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };
}

export default {
    promisify,
};

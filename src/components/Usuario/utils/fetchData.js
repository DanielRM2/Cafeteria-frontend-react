const BASE_URL = import.meta.env.VITE_API_URL

const getSuspender = (promise) => {
    let status = "pending";
    let response;

    const suspender = promise.then(
        (res) => {
            status = "success";
            response = res;
        },
        (err) => {
            status = "error";
            response = err;
        }
    );

    const read = () => {
        switch (status) {
            case "pending":
                throw suspender;
            case "error":
                throw response;
            default:
                return response;
        }
    };

    return { read };
};

export function fetchData(endpoint) {
    const promise = fetch(`${BASE_URL}${endpoint}`)
        .then((response) => response.json())
        .then((json) => json);

    return getSuspender(promise);
}

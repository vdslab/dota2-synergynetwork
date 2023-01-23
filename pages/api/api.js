export async function request(jsonData) {
    const response = await fetch("https://mds-xd44p75ygq-de.a.run.app/", {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
    });
    console.log(response);
    const json = await response.json();
    return json;
}
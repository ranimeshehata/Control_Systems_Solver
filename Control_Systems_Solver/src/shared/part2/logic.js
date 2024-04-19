const api = 'http://localhost:3000/api';
export async function solve(chsFunction) {
    console.log("sending",chsFunction);
    const response = await fetch(`${api}/solve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chsFunction }),
    });
    console.log(response);
    if (response.ok) {
        return response.json(); 
    } else {
        throw new Error('Failed to fetch file');
    }
}
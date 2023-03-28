
export async function chatResponse(messages:{role:string, content:string}[]) {
    const response = await fetch(' http://127.0.0.1:5000/api/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'no-cors'
        },
        // mode: "no-cors",
        // referrerPolicy: "no-referrer",
        body: JSON.stringify({
          messages:messages
        })
      })
 
    return response.json();
}

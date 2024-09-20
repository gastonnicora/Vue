let URL
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  URL = 'http://localhost:4000'
} else {
  URL = `${location.origin}/api`
}

export async function get (url, method, token) {
  try {
    const response = await fetch(URL + url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-tokens': token
      }
    })
    console.log(URL + url)
    const json = await response.json()
    console.log(json)
    return json
  } catch (error) {
    console.log('Error Fetching data ', error)
    return { error: 'Error en la conección', cod: 400 }
  }
}

export async function post (url, method, token = null, data = null) {
  try {
    const response = await fetch(URL + url, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-access-tokens': token
      },
      body: data
    })
    const json = await response.json()
    return json
  } catch (error) {
    console.log('Error Fetching data ', error)
    return { error: 'Error en la conección', cod: 400 }
  }
}

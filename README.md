# HTTP Auth examples

## Cookie + Session

Start the express server with session support: `npm run cookies`

Open the web page at `http://localhost:3000/cookies.html`

Check the browser cookies after a successfull login.
In Chrome: F12 => Tab 'Application' => Sidebar 'Cookies' within 'Storage' => 'http://localhost:3000'
You should see an item with the Key 'connect.sid'

This cookie is automatically added to every request to 'http://localhost:3000'.

## Auth header + Token 

Start the express server with session support: `npm run tokens`

Open the web page at `http://localhost:3000/tokens.html`

Check the browser localStorage after a successfull login.
In Chrome: F12 => Tab 'Application' => Sidebar 'Local Storage' within 'Storage' => 'http://localhost:3000'
You should see an item with the Key 'token'

This token is manually added to the /employee request as 'Authorization' header.
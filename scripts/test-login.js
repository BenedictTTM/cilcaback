const EMAIL = 'palomakut1@gmail.com';
const PASSWORD = 'password';

async function main() {
  try {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch (e) {
    console.error(e);
  }
}
main();

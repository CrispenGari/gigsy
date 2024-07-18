const { CLERK_PUBLISHABLE_SECRETE_KEY } = process.env;

export async function POST(req: Request) {
  try {
    const { userId, password } = await req.json();
    const url = `https://api.clerk.com/v1/users/${userId}/verify_password`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CLERK_PUBLISHABLE_SECRETE_KEY}`,
      },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!!data?.errors?.length) {
      const [error] = data.errors;
      return Response.json({ error: error.long_message }, { status: 200 });
    } else {
      return Response.json({ verified: true }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error." }, { status: 500 });
  }
}

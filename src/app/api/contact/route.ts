const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbylkYQ5DhfXav3eARdZF5f4HzbSlJtzli1HLKQXW7Tdq1lU_nkFSw0v_v9GQBz-LezG/exec";

const REQUIRED_FIELDS = [
  "Name",
  "Email",
  "Mobile",
  "Message",
  "How did you hear about us?",
];

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const incomingFormData = await request.formData();
  const honeypot = incomingFormData.get("_gotcha");

  if (typeof honeypot === "string" && honeypot.trim().length > 0) {
    return Response.json({ message: "Submitted." });
  }

  const clientKey = getClientKey(request);
  const rateLimit = checkRateLimit(clientKey);

  if (!rateLimit.allowed) {
    return Response.json(
      { message: "Too many submissions. Please try again in a few minutes." },
      {
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
        status: 429,
      },
    );
  }

  const values: Record<string, string> = {};

  for (const field of REQUIRED_FIELDS) {
    const value = incomingFormData.get(field);

    if (typeof value !== "string" || value.trim().length === 0) {
      return Response.json({ message: `${field} is required.` }, { status: 400 });
    }

    values[field] = value.trim();
  }

  const payload = {
    email: values.Email,
    heardAbout: values["How did you hear about us?"],
    message: values.Message,
    mobile: values.Mobile,
    name: values.Name,
    phone: values.Mobile,
    timestamp: new Date().toISOString(),
  };

  try {
    const scriptResponse = await fetch(SCRIPT_URL, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      redirect: "follow",
    });

    const responseText = await scriptResponse.text();
    const scriptResult = parseScriptResponse(responseText);

    if (!scriptResponse.ok || scriptResult?.result === "error") {
      return Response.json(
        {
          message: "Google Sheets rejected the submission.",
          scriptResult,
          scriptResponse: responseText.slice(0, 500),
          scriptStatus: scriptResponse.status,
        },
        { status: 502 },
      );
    }

    return Response.json({ message: "Submitted." });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Could not reach Google Sheets.",
      },
      { status: 502 },
    );
  }
}

function parseScriptResponse(responseText: string) {
  try {
    return JSON.parse(responseText) as { error?: string; result?: string };
  } catch {
    return null;
  }
}

function getClientKey(request: Request) {
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function checkRateLimit(clientKey: string) {
  const now = Date.now();
  const current = rateLimitStore.get(clientKey);

  for (const [key, value] of rateLimitStore) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, retryAfterMs: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_SUBMISSIONS) {
    return { allowed: false, retryAfterMs: current.resetAt - now };
  }

  current.count += 1;
  rateLimitStore.set(clientKey, current);

  return { allowed: true, retryAfterMs: 0 };
}

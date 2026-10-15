import { NextRequest, NextResponse } from "next/server";

const API_PREFIX = "/api/v1";

async function proxyRequest(request: NextRequest) {
  const backendApiUrl =
    process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!backendApiUrl) {
    return NextResponse.json(
      { message: "Backend API URL is not configured" },
      { status: 500 },
    );
  }

  const baseUrl = backendApiUrl.replace(/\/+$/, "");
  const path = request.nextUrl.pathname.slice(API_PREFIX.length);
  const targetUrl = `${baseUrl}${path}${request.nextUrl.search}`;
  const headers = new Headers();

  for (const name of ["accept", "authorization", "content-type", "cookie"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  for (const [name, value] of upstreamResponse.headers) {
    if (
      name !== "connection" &&
      name !== "content-encoding" &&
      name !== "content-length" &&
      name !== "transfer-encoding"
    ) {
      responseHeaders.append(name, value);
    }
  }

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;

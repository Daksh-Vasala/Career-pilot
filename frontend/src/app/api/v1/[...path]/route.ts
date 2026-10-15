import { NextRequest, NextResponse } from "next/server";
import { getBackendApiBaseUrl } from "@/lib/backend-api-url";

async function proxyRequest(request: NextRequest) {
  if (!process.env.BACKEND_API_URL && !process.env.NEXT_PUBLIC_API_URL) {
    return NextResponse.json(
      { message: "Backend API URL is not configured" },
      { status: 500 },
    );
  }

  const baseUrl = getBackendApiBaseUrl();
  const path = request.nextUrl.pathname.slice("/api/v1".length);
  const targetUrl = `${baseUrl}${path}${request.nextUrl.search}`;
  const headers = new Headers();

  for (const name of [
    "accept",
    "access-control-request-headers",
    "access-control-request-method",
    "authorization",
    "content-type",
    "cookie",
    "origin",
  ]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = !["GET", "HEAD", "OPTIONS"].includes(request.method);
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
  responseHeaders.set("x-careerpilot-upstream", "backend");

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
export const OPTIONS = proxyRequest;

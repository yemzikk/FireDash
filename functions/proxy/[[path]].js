/**
 * Cloudflare Pages Function — Built-in CORS proxy for Firefly III API.
 *
 * Route: /proxy/<endpoint>
 * The target Firefly III base URL is sent via the X-Target-Base header.
 * Authorization header is forwarded as-is.
 *
 * Security:
 *  - Only /api/ paths on the target are allowed (prevents open-proxy abuse).
 *  - Authorization header is required (no anonymous proxying).
 *  - Target must be HTTPS (except localhost for dev).
 */

function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, Accept, X-Target-Base',
        'Access-Control-Max-Age': '86400',
    };
}

function jsonError(message, status) {
    return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    });
}

export async function onRequest(context) {
    const { request, params } = context;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders() });
    }

    // Require X-Target-Base header (the user's Firefly III URL)
    const targetBase = request.headers.get('X-Target-Base');
    if (!targetBase) {
        return jsonError('X-Target-Base header is required', 400);
    }

    // Require Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return jsonError('Valid Authorization Bearer header is required', 401);
    }

    // Validate target base URL
    let baseUrl;
    try {
        baseUrl = new URL(targetBase);
    } catch {
        return jsonError('Invalid X-Target-Base URL', 400);
    }

    // Must be HTTPS (allow HTTP only for localhost dev)
    const isLocalhost = baseUrl.hostname === 'localhost' || baseUrl.hostname === '127.0.0.1';
    if (baseUrl.protocol !== 'https:' && !isLocalhost) {
        return jsonError('Target URL must use HTTPS', 400);
    }

    // Build the endpoint path from catch-all segments
    const pathSegments = params.path || [];
    const endpoint = '/' + pathSegments.join('/');

    // Only allow /api/ paths to prevent open-proxy abuse
    if (!endpoint.startsWith('/api/')) {
        return jsonError('Only Firefly III /api/ paths are allowed', 403);
    }

    // Build the full target URL with query params from the original request
    const requestUrl = new URL(request.url);
    const targetUrl = new URL(baseUrl.origin + endpoint);
    requestUrl.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
    });

    // Forward the request to the target Firefly III instance
    try {
        const targetResponse = await fetch(targetUrl.toString(), {
            method: request.method,
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            // Forward body for POST/PUT
            body: ['POST', 'PUT', 'PATCH'].includes(request.method) ? request.body : undefined,
        });

        // Stream the response back with CORS headers
        const responseHeaders = new Headers(corsHeaders());
        responseHeaders.set(
            'Content-Type',
            targetResponse.headers.get('Content-Type') || 'application/json'
        );

        return new Response(targetResponse.body, {
            status: targetResponse.status,
            statusText: targetResponse.statusText,
            headers: responseHeaders,
        });
    } catch (err) {
        return jsonError(
            'Failed to reach Firefly III server: ' + (err.message || 'Unknown error'),
            502
        );
    }
}

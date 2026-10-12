const API_URL = 'http://localhost:3001';
const TIMESTAMP = Date.now();

async function runTests() {
    console.log('--- Starting Blog API Tests ---');

    // 1. Signup a test user
    let token = '';
    console.log(`\n=> [1] Creating a test user for auth`);
    try {
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test_blog_${TIMESTAMP}@example.com`,
                password: 'Password123!',
                firstName: 'Blog',
                lastName: 'Tester'
            })
        });

        // Auth might return a token directly on signup, else we'll login
        if (!signupRes.ok) {
            console.log('Signup failed or user exists, attempting login...', await signupRes.text());
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: `test_blog_${TIMESTAMP}@example.com`,
                    password: 'Password123!'
                })
            });
            const loginData = await loginRes.json();
            token = loginData.accessToken || loginData.token;
        } else {
            const data = await signupRes.json();
            token = data.accessToken || data.token || data.access_token;
        }

        if (!token) throw new Error('No token obtained. Cannot proceed.');
        console.log(`✓ Obtained Auth Token: ${token.substring(0, 20)}...`);
    } catch (err) {
        console.error('✗ Auth failed:', err.message);
        return;
    }

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // 2. Create a Post
    let postId = null;
    console.log(`\n=> [2] Testing POST /blog (Create Post)`);
    try {
        const res = await fetch(`${API_URL}/blog`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
                title: `E2E Test Post ${TIMESTAMP}`,
                content: 'This is the content of the blog post created via E2E testing. It needs to be at least 10 chars.',
                category: 'Technology',
                tags: ['E2E', 'Testing'],
                status: 'PUBLISHED'
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        postId = data.id;
        console.log('✓ Successfully created post:', { id: data.id, title: data.title });
    } catch (err) {
        console.error('✗ Create failed:', err.message);
        return;
    }

    // 3. Get Posts (Public)
    console.log(`\n=> [3] Testing GET /blog (List Posts)`);
    try {
        const res = await fetch(`${API_URL}/blog?limit=5`);
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        console.log(`✓ Successfully retrieved posts. Total: ${data.meta?.total || data.data?.length || 'Unknown'}`);
        const found = data.data && data.data.some(p => p.id === postId);
        console.log(`  -> Current post found in list: ${found}`);
    } catch (err) {
        console.error('✗ Get posts failed:', err.message);
    }

    // 4. Update the Post
    console.log(`\n=> [4] Testing PUT /blog/${postId} (Update Post)`);
    try {
        const res = await fetch(`${API_URL}/blog/${postId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
                title: `Updated E2E Test Post ${TIMESTAMP}`,
                tags: ['E2E', 'Updated'],
                status: 'PUBLISHED'
            })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        console.log('✓ Successfully updated post title to:', data.title);
        console.log('  -> Updated tags:', data.tags);
        console.log('  -> Updated status:', data.status);
    } catch (err) {
        console.error('✗ Update failed:', err.message);
    }

    // 5. Toggle Like
    console.log(`\n=> [5] Testing POST /blog/${postId}/like (Toggle Like)`);
    try {
        const res = await fetch(`${API_URL}/blog/${postId}/like`, {
            method: 'POST',
            headers: authHeaders
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        console.log('✓ Successfully toggled like. State:', data);
    } catch (err) {
        console.error('✗ Like toggle failed:', err.message);
    }

    // 6. Delete the Post
    console.log(`\n=> [6] Testing DELETE /blog/${postId} (Delete Post)`);
    try {
        const res = await fetch(`${API_URL}/blog/${postId}`, {
            method: 'DELETE',
            headers: authHeaders
        });
        const data = await res.json();
        if (!res.ok) throw new Error(JSON.stringify(data));
        console.log('✓ Successfully deleted post.');
    } catch (err) {
        console.error('✗ Delete failed:', err.message);
    }

    console.log('\n--- Blog API Tests Complete ---');
}

runTests();

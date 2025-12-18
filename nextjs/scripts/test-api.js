/**
 * Simple API testing script
 * Run with: node scripts/test-api.js
 * 
 * Note: This requires authentication. For full testing, use Postman or the frontend.
 */

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options)
    const data = await response.json()

    console.log(`\n${method} ${endpoint}`)
    console.log(`Status: ${response.status}`)
    console.log('Response:', JSON.stringify(data, null, 2))

    return { status: response.status, data }
  } catch (error) {
    console.error(`Error testing ${endpoint}:`, error.message)
    return { error: error.message }
  }
}

async function runTests() {
  console.log('🧪 API Testing Script')
  console.log('='.repeat(50))
  console.log(`Testing API at: ${API_BASE}`)
  console.log('\nNote: Most endpoints require authentication.')
  console.log('For authenticated endpoints, use Postman or test via frontend.\n')

  // Test public endpoints
  console.log('\n📦 Testing Public Endpoints...')
  
  await testAPI('/api/products')
  await testAPI('/api/categories')
  await testAPI('/api/brands')

  // Test newsletter (no auth required)
  console.log('\n📧 Testing Newsletter API...')
  await testAPI('/api/newsletter/subscribe', 'POST', {
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User'
  })

  // Note: Cart, Orders, Wishlist, etc. require authentication
  console.log('\n⚠️  Authenticated Endpoints:')
  console.log('These require a valid session. Test them via:')
  console.log('1. Frontend (after logging in)')
  console.log('2. Postman (with session cookie)')
  console.log('3. Browser DevTools (after logging in)')
  
  console.log('\n✅ Public API tests completed!')
  console.log('\nFor full testing:')
  console.log('1. Start the dev server: npm run dev')
  console.log('2. Login via frontend')
  console.log('3. Test features in browser')
  console.log('4. Check Network tab for API calls')
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error)
}

module.exports = { testAPI, runTests }


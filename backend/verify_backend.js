const emails = [
  {
    name: "Urgent Action (Boss)",
    payload: {
      subject: "URGENT: Quarterly Review Data Needed",
      from: "manager@company.com",
      body: "Hi, I need the final numbers for the Q1 review by 4pm today. We have the board meeting at 5pm. Thanks.",
      senderName: "Sarah Manager"
    }
  },
  {
    name: "Needs Reply (Coworker)",
    payload: {
      subject: "Quick question on the API docs",
      from: "dev-peer@company.com",
      body: "Hey, do you know where we stored the Swagger definitions for the new auth service? Can't find them in the wiki.",
      senderName: "Dave Developer"
    }
  },
  {
    name: "Promotional (Newsletter)",
    payload: {
      subject: "Save 50% on Cloud Credits!",
      from: "marketing@cloudprovider.net",
      body: "Last chance to grab our summer deal! Upgrade your plan today and get 50% off for the first 6 months.",
      senderName: "Cloud Sales"
    }
  }
];

async function runTests() {
  console.log("🚀 Starting ARIA Backend Verification Tests...\n");

  try {
    // 1. Health Check
    console.log("--- 1. Testing Health Check ---");
    const healthRes = await fetch("http://localhost:3000/api/health");
    console.log("Status:", healthRes.status);
    console.log("Data:", await healthRes.json());
    console.log("\n");

    // 2. Single Triage Tests
    console.log("--- 2. Testing Individual Triage ---");
    for (const email of emails) {
      console.log(`Testing: ${email.name}`);
      const res = await fetch("http://localhost:3000/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email.payload)
      });
      const data = await res.json();
      console.log("Result:", {
        priority: data.data.priority_score,
        category: data.data.category,
        action: data.data.action,
        reason: data.data.reason
      });
      console.log("-");
    }
    console.log("\n");

    // 3. Batch Triage Test
    console.log("--- 3. Testing Batch Triage ---");
    const batchRes = await fetch("http://localhost:3000/api/triage/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails: emails.map(e => e.payload) })
    });
    const batchData = await batchRes.json();
    console.log("Batch Summary:", batchData.data.summary);
    console.log("\n");

    console.log("✅ All tests completed successfully!");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
}

runTests();

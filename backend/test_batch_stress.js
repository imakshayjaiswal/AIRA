/**
 * Stress test for Batch Triage with sliding window concurrency.
 * Tests 10 emails simultaneously and verifies correct indexing.
 */

const baseEmail = {
  subject: "Batch Stress Test Item #",
  from: "tester@example.com",
  body: "This is a test email body for batch processing verification."
};

async function runStressTest() {
  console.log("🔥 Starting Batch Stress Test (Sliding Window)...");
  
  const emails = Array.from({ length: 12 }, (_, i) => ({
    ...baseEmail,
    subject: baseEmail.subject + i,
    // Intentionally make one "fail" by providing bad data if possible, 
    // but for now, we just want to see the 5-at-a-time flow in logs.
  }));

  const startTime = Date.now();

  try {
    const res = await fetch("http://localhost:3000/api/triage/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails })
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    const duration = Date.now() - startTime;

    console.log(`\n📊 Batch Results (${duration}ms):`);
    console.log(`Total: ${data.data.summary.totalEmails}`);
    console.log(`Processed: ${data.data.summary.processed}`);
    console.log(`Failed: ${data.data.summary.failed}`);
    
    // Verify that the index in the result matches its position in the array
    const indexingValid = data.data.results.every((r, i) => r.index === i);
    console.log(`\nIndexing Integrity Check: ${indexingValid ? "✅ VALID" : "❌ FAILED"}`);

    if (indexingValid) {
      console.log("\nResults trace:");
      data.data.results.forEach(r => {
        if (r.success) {
          console.log(`[${r.index}] SUCCESS: ${r.result.urgency_level} (${r.result.priority_score})`);
        } else {
          console.log(`[${r.index}] FAILED: ${r.error}`);
        }
      });
    }

    console.log("\n✅ Stress test concluded.");
  } catch (err) {
    console.error("❌ Stress test failed:", err.message);
  }
}

runStressTest();

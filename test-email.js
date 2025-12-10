const { Resend } = require("resend");

const resend = new Resend("re_DciCmXDe_9YWF1PRk7fZgz34JCJg1ZEfw");

async function testEmail() {
  try {
    console.log("🔄 Sending test email to jubriloyebamiji@gmail.com...");

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "jubriloyebamiji@gmail.com",
      subject: "Test Email from BuyEasy Localhost",
      html: "<h1>Test Email</h1><p>This is a test email from your localhost development environment.</p>",
    });

    if (error) {
      console.error("❌ Email sending failed:", error);
      return;
    }

    console.log("✅ Email sent successfully!");
    console.log("📧 Email ID:", data.id);
    console.log("\n📝 Next steps:");
    console.log("1. Check your inbox at ayojubril68@gmail.com");
    console.log("2. If no email received, check:");
    console.log(
      "   - Is ayojubril68@gmail.com the email you used to sign up for Resend?"
    );
    console.log("   - Check your spam/junk folder");
    console.log("   - Go to https://resend.com/emails to see email status");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testEmail();

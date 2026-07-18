/**
 * Email HTML templates for Inba Mart email services.
 * Curated for premium aesthetics, modern font stacks, responsive layouts,
 * and standard email client compatibility.
 */

const getWelcomeOtpTemplate = (otp) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #1e293b; min-height: 100%;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background-color: #00927c; padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px; font-family: 'Outfit', sans-serif;">INBA MART</h1>
          <p style="color: #e6fffa; margin: 6px 0 0 0; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">Welcome to Your Store Integration Portal</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Verify Your Account</h2>
          <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 1.6; color: #475569;">
            Welcome to Inba Mart! To finish setting up your profile or complete your login verification, please use the 6-digit verification code below.
          </p>

          <!-- OTP Display box -->
          <div style="background-color: #f1f5f9; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; border: 1px dashed #cbd5e1;">
            <span style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">Verification Code</span>
            <span style="font-size: 36px; font-family: 'Courier New', Courier, monospace; font-weight: 800; color: #00927c; letter-spacing: 6px; display: inline-block;">${otp}</span>
          </div>

          <p style="margin: 0 0 28px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
            This one-time passcode is valid for the next 15 minutes. If you did not initiate this request, you can safely ignore this email.
          </p>
          
          <div style="border-top: 1px solid #edf2f7; padding-top: 20px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              Please do not reply directly to this email. For support, contact <a href="mailto:support@inbamart.com" style="color: #00927c; text-decoration: none; font-weight: 600;">support@inbamart.com</a>.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} Inba Mart Inc. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;
};

const getResetPasswordOtpTemplate = (otp) => {
  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #1e293b; min-height: 100%;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header -->
        <div style="background-color: #00927c; padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 1px;">INBA MART</h1>
          <p style="color: #e6fffa; margin: 6px 0 0 0; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">Store Security Center</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Password Reset Request</h2>
          <p style="margin: 0 0 24px 0; font-size: 14.5px; line-height: 1.6; color: #475569;">
            We received a request to reset the password for your vendor account. Please use the following code to authorize this change:
          </p>

          <!-- OTP Display box -->
          <div style="background-color: #fffbeb; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0; border: 1px dashed #fcd34d;">
            <span style="font-size: 11px; font-weight: 800; color: #b45309; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px;">Reset Authorization Code</span>
            <span style="font-size: 36px; font-family: 'Courier New', Courier, monospace; font-weight: 800; color: #d97706; letter-spacing: 6px; display: inline-block;">${otp}</span>
          </div>

          <p style="margin: 0 0 28px 0; font-size: 13px; line-height: 1.5; color: #64748b;">
            This security code is active for 15 minutes. If you did not request a password reset, your password will remain unchanged and you can safely ignore this email.
          </p>
          
          <div style="border-top: 1px solid #edf2f7; padding-top: 20px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              Need help? Reach out to <a href="mailto:support@inbamart.com" style="color: #00927c; text-decoration: none; font-weight: 600;">support@inbamart.com</a>.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
            &copy; ${new Date().getFullYear()} Inba Mart Inc. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;
};

const getInvoiceTemplate = (user, orders) => {
  let invoiceItemsHtml = "";
  let subtotal = 0;

  for (let order of orders) {
    if (order.orderItems && Array.isArray(order.orderItems)) {
      for (let item of order.orderItems) {
        const productTitle = item.product ? item.product.title : "Product Item";
        const quantity = item.quantity || 1;
        const price = item.sellingPrice || 0;
        const itemTotal = quantity * price;
        subtotal += itemTotal;

        invoiceItemsHtml += `
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 14px 12px; font-size: 13.5px; color: #1e293b; text-align: left;">
              <strong style="color: #0f172a;">${productTitle}</strong>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Seller: ${order.seller?.sellerName || "Partner Vendor"}</div>
            </td>
            <td style="padding: 14px 12px; font-size: 13.5px; color: #475569; text-align: center;">${item.size || "N/A"}</td>
            <td style="padding: 14px 12px; font-size: 13.5px; color: #475569; text-align: center;">${quantity}</td>
            <td style="padding: 14px 12px; font-size: 13.5px; color: #475569; text-align: right;">₹${price}</td>
            <td style="padding: 14px 12px; font-size: 13.5px; color: #0f172a; text-align: right; font-weight: bold;">₹${itemTotal}</td>
          </tr>
        `;
      }
    }
  }

  const shippingAddress = orders[0] && orders[0].shippingAddress ? orders[0].shippingAddress : null;
  const addressHtml = shippingAddress ? `
    <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: bold;">${shippingAddress.name}</p>
    <p style="margin: 4px 0 0 0; color: #475569; font-size: 13px; line-height: 1.4;">${shippingAddress.streetAddress}, ${shippingAddress.city}</p>
    <p style="margin: 2px 0 0 0; color: #475569; font-size: 13px;">${shippingAddress.state} - ${shippingAddress.pinCode}</p>
    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 12px; font-weight: 500;">Mobile: ${shippingAddress.mobile}</p>
  ` : `<p style="margin: 0; color: #64748b; font-size: 13px;">No shipping address details attached.</p>`;

  return `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #1e293b; min-height: 100%;">
      <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
        
        <!-- Header banner -->
        <div style="background-color: #00927c; padding: 36px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px;">INBA MART</h1>
          <p style="color: #e6fffa; margin: 6px 0 0 0; font-size: 13.5px; font-weight: 500; letter-spacing: 0.5px;">Purchase Invoice Receipt</p>
        </div>

        <div style="padding: 32px 24px;">
          <!-- Greeting -->
          <p style="margin: 0 0 16px 0; font-size: 15px; color: #0f172a;">Hi <strong>${user.fullName}</strong>,</p>
          <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.5; color: #475569;">
            Your transaction was approved and completed. Below is the summary itemized receipt of your order:
          </p>

          <!-- Meta box -->
          <div style="background-color: #f8fafc; border-radius: 10px; padding: 16px; margin-bottom: 28px; border: 1px solid #e2e8f0; font-size: 13px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Transaction Date:</td>
                <td style="padding: 4px 0; text-align: right; color: #0f172a; font-weight: bold;">${new Date().toLocaleDateString(undefined, { dateStyle: "long" })}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Email Account:</td>
                <td style="padding: 4px 0; text-align: right; color: #0f172a; font-weight: bold;">${user.email}</td>
              </tr>
            </table>
          </div>

          <!-- Shipping details -->
          <div style="margin-bottom: 28px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px;">
            <h3 style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; margin: 0 0 10px 0; letter-spacing: 0.8px; border-bottom: 1px solid #edf2f7; padding-bottom: 6px;">Delivery Details</h3>
            ${addressHtml}
          </div>

          <!-- Item Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-size: 10.5px; font-weight: bold; text-transform: uppercase; color: #475569;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center; width: 60px;">Size</th>
                <th style="padding: 10px; text-align: center; width: 50px;">Qty</th>
                <th style="padding: 10px; text-align: right; width: 90px;">Price</th>
                <th style="padding: 10px; text-align: right; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceItemsHtml}
            </tbody>
          </table>

          <!-- Pricing summary -->
          <div style="border-top: 2px solid #edf2f7; padding-top: 16px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="font-size: 16px; font-weight: bold; color: #0f172a;">
                <td>Grand Total Paid:</td>
                <td style="text-align: right; color: #00927c; font-size: 20px;">₹${subtotal}</td>
              </tr>
            </table>
          </div>

          <!-- Thank you note -->
          <div style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #edf2f7; padding-top: 20px;">
            <p style="margin: 0;">We appreciate your business. Thank you for buying from Inba Mart!</p>
          </div>

        </div>
      </div>
    </div>
  `;
};

module.exports = {
  getWelcomeOtpTemplate,
  getResetPasswordOtpTemplate,
  getInvoiceTemplate
};

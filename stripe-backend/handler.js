"use strict";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.checkout = async (event, context, callback) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    let amount = JSON.parse(event.body).amount * 100;
    // add stripe fees
    if (typeof amount === "undefined" || isNaN(amount)) {
      amount = 15000;
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Wedding's gift",
              images: ['https://filipasaidyes.com/assets/img/flowers.png'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "https://filipasaidyes.com?status=success&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://filipasaidyes.com?status=cancel",
    });
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://filipasaidyes.com",
      },
      body: JSON.stringify({
        session: session,
      }),
    };
    callback(null, response);
};

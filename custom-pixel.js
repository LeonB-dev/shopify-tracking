//-------------------------------------------------------- 
//--- Customer Events custom pixel (purchase tracking) ---
//--------------------------------------------------------
// Paste this into: Shopify admin → Settings → Customer events → "datalayer pixel" 
// Search for GTM-XXX and update with actual value : )

window.dataLayer = window.dataLayer || [];

(async () => {
  let clientId;
  try {
    const ga = await browser.cookie.get("_ga"); 
    if (ga) clientId = ga.split(".").slice(-2).join("."); 
  } catch (e) {}

  window.dataLayer.push({ client_id: clientId });

  // Load GTM inside the sandbox
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-XXX");
})();

// 2. Purchase — checkout_completed → GA4 purchase (standard nested ecommerce shape)
analytics.subscribe("checkout_completed", (event) => {
  const checkout = event.data?.checkout;

  const items = (checkout?.lineItems || []).map((item) => ({
    item_id: item.variant?.sku || item.variant?.product?.id,
    item_name: item.variant?.product?.title || item.title,
    item_variant: item.variant?.title,
    quantity: item.quantity,
    price: Number(item.variant?.price?.amount), // unit price, not line total
  }));

  window.dataLayer.push({ ecommerce: null }); // clear any previous ecommerce object
  window.dataLayer.push({
    event: "checkout_completed",
    ecommerce: {
      transaction_id: checkout?.order?.id,
      value: Number(checkout?.totalPrice?.amount),
      currency: checkout?.currencyCode,
      tax: Number(checkout?.totalTax?.amount),
      shipping: Number(checkout?.shippingLine?.price?.amount),
      items: items,
    },
  });
});

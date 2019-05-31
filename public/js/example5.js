(function() {
  "use strict";

  var elements = stripe.elements({
    // Stripe's examples are localized to specific languages, but if
    // you wish to have Elements automatically detect your user's locale,
    // use `locale: 'auto'` instead.
    locale: window.__exampleLocale
  });

  /**
   * Card Element
   */
  var card = elements.create("card", {
    iconStyle: "solid",
    style: {
      base: {
        iconColor: "#fff",
        color: "#fff",
        fontWeight: 400,
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",

        "::placeholder": {
          color: "#BFAEF6"
        },
        ":-webkit-autofill": {
          color: "#fce883"
        }
      },
      invalid: {
        iconColor: "#FFC7EE",
        color: "#FFC7EE"
      }
    }
  });
  card.mount("#example5-card");

  var url = "https://62cbc05a.ngrok.io/api/v2/payment/subscription";

  $('#payment-form').submit(function(e) {
    e.preventDefault();
    var form = $(this);
    var formData = form.serialize();
    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the customer that there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        // console.log(result.token);
        // Send the token to your server.
        console.log(result.token.id);
        // stripeTokenHandler(result.token);
        testStripeTokenHandler(result.token);
        // Get data from form
        // console.log(form.serialize());
        formData = formData.concat(form.serialize());

        $.ajax({
          type: "POST",
          url: url,
          data: formData, // serializes the form's elements.
          success: function(response){
            alert(response);
          },
          error: function(xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
          }
        });

        $('input[name=stripeToken]').remove();
        return false;
      }
    });
  });

  // 用來創建Day訂閱的用戶
  function testStripeTokenHandler(token) {
    var form = $('#payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.append(hiddenInput);

    // Subscription day plan
    var monthlyPlan = document.createElement('input');
    monthlyPlan.setAttribute('type', 'hidden');
    monthlyPlan.setAttribute('name', 'planId');
    monthlyPlan.setAttribute('value', 'plan_F7Of1iCb4NOTjx');
    form.append(monthlyPlan);

    // Subscription usage day plan
    var usagePlan = document.createElement('input');
    usagePlan.setAttribute('type', 'hidden');
    usagePlan.setAttribute('name', 'usagePlanId');
    usagePlan.setAttribute('value', 'plan_F7PH4n92lcNqkV');
    form.append(usagePlan);

  }

  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = $('#payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.append(hiddenInput);

    // Subscription monthly plan
    var monthlyPlan = document.createElement('input');
    monthlyPlan.setAttribute('type', 'hidden');
    monthlyPlan.setAttribute('name', 'planId');
    monthlyPlan.setAttribute('value', 'plan_F43FWje6tCZx3p');
    form.append(monthlyPlan);

    // Subscription usage plan
    var usagePlan = document.createElement('input');
    usagePlan.setAttribute('type', 'hidden');
    usagePlan.setAttribute('name', 'usagePlanId');
    usagePlan.setAttribute('value', 'plan_F4qbbCQIq4kKWE');
    form.append(usagePlan);

    // Submit the form
    // form.submit();
  }

  /**
   * Payment Request Element
   */
  // var paymentRequest = stripe.paymentRequest({
  //   country: "US",
  //   currency: "usd",
  //   total: {
  //     amount: 2500,
  //     label: "Total"
  //   },
  //   requestShipping: true,
  //   shippingOptions: [
  //     {
  //       id: "free-shipping",
  //       label: "Free shipping",
  //       detail: "Arrives in 5 to 7 days",
  //       amount: 0
  //     }
  //   ]
  // });

  // paymentRequest.on("token", function(result) {
  //   var example = document.querySelector(".example5");
  //   example.querySelector(".token").innerText = result.token.id;
  //   example.classList.add("submitted");
  //   result.complete("success");
  // });

  // var paymentRequestElement = elements.create("paymentRequestButton", {
  //   paymentRequest: paymentRequest,
  //   style: {
  //     paymentRequestButton: {
  //       theme: "light"
  //     }
  //   }
  // });

  // paymentRequest.canMakePayment().then(function(result) {
  //   if (result) {
  //     document.querySelector(".example5 .card-only").style.display = "none";
  //     document.querySelector(
  //       ".example5 .payment-request-available"
  //     ).style.display =
  //       "block";
  //     paymentRequestElement.mount("#example5-paymentRequest");
  //   }
  // });

  registerElements([card], "example5");
})();
